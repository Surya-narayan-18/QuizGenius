const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

// ─── Load environment variables ─────────────────────────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Configuration ──────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-3.5-flash';
const MAX_RETRIES = 3;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const QUIZ_TOKEN_SECRET = process.env.QUIZ_TOKEN_SECRET;

// ─── Middleware ──────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Token Helpers ──────────────────────────────────────────────────────────────

function signToken(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', QUIZ_TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    const lastDot = token.lastIndexOf('.');
    if (lastDot === -1) return null;

    const payload = token.substring(0, lastDot);
    const signature = token.substring(lastDot + 1);

    const expectedSig = crypto
      .createHmac('sha256', QUIZ_TOKEN_SECRET)
      .update(payload)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'utf8');
    const expectedBuf = Buffer.from(expectedSig, 'utf8');

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// ─── Gemini API Call ────────────────────────────────────────────────────────────

async function callGemini(topic, difficulty, numQuestions) {
  const difficultyGuide = {
    easy: 'basic, widely known facts — suitable for beginners',
    medium: 'intermediate knowledge — requires some familiarity with the topic',
    hard: 'advanced, nuanced questions — requires deep expertise',
  };

  const prompt = `Generate exactly ${numQuestions} multiple-choice quiz questions about "${topic}" at ${difficulty} difficulty level (${difficultyGuide[difficulty]}).

Return ONLY a valid JSON array — no markdown fences, no commentary, no extra text. Each element must match this exact structure:
{
  "question": "The question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "One-sentence explanation of why the correct answer is right"
}

Rules:
- The array must contain exactly ${numQuestions} objects.
- Each object must have exactly 4 options.
- "correctIndex" must be an integer from 0 to 3.
- Questions must be factually accurate and unambiguous.
- All 4 options must be plausible — no joke answers.
- Do NOT repeat questions.
- Return ONLY the raw JSON array.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini API returned ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  // Parse JSON — strip markdown fences if present
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  }

  const questions = JSON.parse(jsonStr);

  // Validate structure
  if (!Array.isArray(questions) || questions.length !== numQuestions) {
    throw new Error(
      `Expected ${numQuestions} questions, got ${Array.isArray(questions) ? questions.length : 'non-array'}`
    );
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (typeof q.question !== 'string' || !q.question.trim()) {
      throw new Error(`Question ${i} has an invalid question text`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${i} must have exactly 4 options`);
    }
    if (
      typeof q.correctIndex !== 'number' ||
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      throw new Error(`Question ${i} has an invalid correctIndex`);
    }
    if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
      throw new Error(`Question ${i} has an invalid explanation`);
    }
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── POST /api/quiz/generate ────────────────────────────────────────────────────

app.post('/api/quiz/generate', async (req, res) => {
  if (!GEMINI_API_KEY || !QUIZ_TOKEN_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured — missing environment variables.' });
  }

  const { topic, difficulty, numQuestions } = req.body || {};

  // Validate input
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'A non-empty topic is required.' });
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Difficulty must be one of: easy, medium, hard.' });
  }
  const num = parseInt(numQuestions, 10);
  if (isNaN(num) || num < 5 || num > 15) {
    return res.status(400).json({ error: 'Number of questions must be between 5 and 15.' });
  }

  // Generate with retries
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const questions = await callGemini(topic.trim(), difficulty, num);

      // Add stable IDs
      const fullQuestions = questions.map((q, i) => ({
        id: `q_${i}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));

      // Sign token containing answers
      const quizToken = signToken(fullQuestions);

      // Strip answers for the client
      const clientQuestions = fullQuestions.map(({ id, question, options }) => ({
        id,
        question,
        options,
      }));

      return res.status(200).json({ quizToken, questions: clientQuestions });
    } catch (err) {
      lastError = err;
      console.error(`[generate] Attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        const delayMs = attempt * 2000;
        console.log(`[generate] Waiting ${delayMs}ms before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return res.status(502).json({
    error: 'Failed to generate quiz questions after multiple attempts. Please try again or choose a different topic.',
  });
});

// ─── POST /api/quiz/submit ──────────────────────────────────────────────────────

app.post('/api/quiz/submit', async (req, res) => {
  if (!QUIZ_TOKEN_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured — missing QUIZ_TOKEN_SECRET.' });
  }

  const { quizToken, answers } = req.body || {};

  if (!quizToken || typeof quizToken !== 'string') {
    return res.status(400).json({ error: 'quizToken is required.' });
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an object mapping question IDs to selected option indexes.' });
  }

  // Verify token
  const questions = verifyToken(quizToken);
  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid or tampered quiz token.' });
  }

  // Score
  let score = 0;
  const results = questions.map((q) => {
    const selectedIndex = typeof answers[q.id] === 'number' ? answers[q.id] : -1;
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) score++;

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      selectedIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  return res.status(200).json({ score, total: questions.length, results });
});

// ─── Serve frontend in production ───────────────────────────────────────────────

// Removed: Frontend is deployed separately on Vercel. 
// The backend only needs to serve API routes.

// ─── Start server ───────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🧠 QuizGenius server running on http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 8) + '...' : '❌ NOT SET'}`);
  console.log(`   QUIZ_TOKEN_SECRET: ${QUIZ_TOKEN_SECRET ? '✅ loaded' : '❌ NOT SET'}`);
});
