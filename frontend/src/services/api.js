/**
 * API service — fetch wrappers for the two quiz endpoints.
 * All errors are normalized into thrown Error objects with user-friendly messages.
 */

export async function generateQuiz({ topic, difficulty, numQuestions }) {
  const res = await fetch('/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty, numQuestions }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error || `Failed to generate quiz (status ${res.status})`
    );
  }
  if (!data?.quizToken || !Array.isArray(data?.questions)) {
    throw new Error('Received an invalid response from the server.');
  }

  return data;
}

export async function submitQuiz({ quizToken, answers }) {
  const res = await fetch('/api/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizToken, answers }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error || `Failed to submit quiz (status ${res.status})`
    );
  }
  if (typeof data?.score !== 'number' || !Array.isArray(data?.results)) {
    throw new Error('Received an invalid scoring response from the server.');
  }

  return data;
}
