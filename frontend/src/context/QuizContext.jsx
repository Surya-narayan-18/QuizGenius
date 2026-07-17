import { createContext, useContext, useState, useCallback } from 'react';
import {
  generateQuiz as apiGenerateQuiz,
  submitQuiz as apiSubmitQuiz,
} from '../services/api';
import { generateFeedback } from '../utils/feedback';

// ─── Context ────────────────────────────────────────────────────────────────────
const QuizContext = createContext(null);

export function useQuizContext() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error('useQuizContext must be used inside <QuizProvider>');
  }
  return ctx;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
/**
 * Decode the base64url payload of an HMAC-signed token to extract the answer key.
 * Used client-side for per-question visual feedback only — the server remains
 * the authority on scoring via /api/quiz/submit.
 */
function decodeTokenPayload(token) {
  try {
    const payload = token.split('.')[0];
    // base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────────
export function QuizProvider({ children }) {
  // Setup state
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(10);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [answerKey, setAnswerKey] = useState([]);
  const [quizToken, setQuizToken] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highestVisitedIndex, setHighestVisitedIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Results state
  const [results, setResults] = useState(null);
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('setup'); // setup | generating | playing | submitting | results

  const clearError = useCallback(() => setError(null), []);

  // ─── Actions ────────────────────────────────────────────────────────
  const startQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPhase('generating');

    try {
      const data = await apiGenerateQuiz({
        topic: topic.trim(),
        difficulty,
        numQuestions,
      });

      setQuestions(data.questions);
      setQuizToken(data.quizToken);
      setAnswerKey(decodeTokenPayload(data.quizToken) || []);
      setCurrentIndex(0);
      setHighestVisitedIndex(0);
      setAnswers({});
      setResults(null);
      setScore(null);
      setTotal(null);
      setPhase('playing');
      return true;
    } catch (err) {
      setError(err.message);
      setPhase('setup');
      return false;
    } finally {
      setLoading(false);
    }
  }, [topic, difficulty, numQuestions]);

  const answerQuestion = useCallback((questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      setHighestVisitedIndex((h) => Math.max(h, nextIdx));
      return nextIdx;
    });
  }, []);

  const goToQuestion = useCallback((index) => {
    setCurrentIndex((prev) => {
      // Only allow navigating to visited questions
      if (index <= highestVisitedIndex) {
        return index;
      }
      return prev;
    });
  }, [highestVisitedIndex]);

  const submitAnswers = useCallback(async () => {
    setSubmitting(true);
    setPhase('submitting');

    try {
      const data = await apiSubmitQuiz({ quizToken, answers });
      setResults(data.results);
      setScore(data.score);
      setTotal(data.total);
      setFeedbackText(generateFeedback(data.score, data.total, topic));
      setPhase('results');
      return true;
    } catch (err) {
      setError(err.message);
      setPhase('playing');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [quizToken, answers]);

  const resetQuiz = useCallback(() => {
    setTopic('');
    setDifficulty('medium');
    setNumQuestions(10);
    setQuestions([]);
    setAnswerKey([]);
    setQuizToken('');
    setCurrentIndex(0);
    setHighestVisitedIndex(0);
    setAnswers({});
    setResults(null);
    setScore(null);
    setTotal(null);
    setFeedbackText('');
    setError(null);
    setPhase('setup');
  }, []);

  const retryTopic = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPhase('generating');

    try {
      const data = await apiGenerateQuiz({
        topic: topic.trim(),
        difficulty,
        numQuestions,
      });

      setQuestions(data.questions);
      setQuizToken(data.quizToken);
      setAnswerKey(decodeTokenPayload(data.quizToken) || []);
      setCurrentIndex(0);
      setHighestVisitedIndex(0);
      setAnswers({});
      setResults(null);
      setScore(null);
      setTotal(null);
      setFeedbackText('');
      setPhase('playing');
      return true;
    } catch (err) {
      setError(err.message);
      setPhase('results');
      return false;
    } finally {
      setLoading(false);
    }
  }, [topic, difficulty, numQuestions]);

  // ─── Computed ───────────────────────────────────────────────────────
  const liveScore = Object.entries(answers).reduce((acc, [questionId, optionIndex]) => {
    const isCorrect = answerKey.find((q) => q.id === questionId)?.correctIndex === optionIndex;
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  // ─── Value ──────────────────────────────────────────────────────────
  const value = {
    // Setup
    topic,
    setTopic,
    difficulty,
    setDifficulty,
    numQuestions,
    setNumQuestions,

    // Quiz
    questions,
    answerKey,
    quizToken,
    currentIndex,
    highestVisitedIndex,
    answers,
    liveScore,

    // Results
    results,
    score,
    total,
    feedbackText,

    // UI
    loading,
    submitting,
    error,
    phase,

    // Actions
    clearError,
    startQuiz,
    answerQuestion,
    nextQuestion,
    goToQuestion,
    submitAnswers,
    resetQuiz,
    retryTopic,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}
