import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import QuizCard from '../components/QuizCard';
import AnswerOption from '../components/AnswerOption';
import ProgressBar from '../components/ProgressBar';
import FeedbackBanner from '../components/FeedbackBanner';
import Sidebar from '../components/Sidebar';
import { ChevronRight, Trophy, Loader2 } from 'lucide-react';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    questions, answerKey, currentIndex, answers,
    answerQuestion, nextQuestion, submitAnswers,
    phase, submitting, topic, difficulty,
  } = useQuizContext();

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'submitting') navigate('/', { replace: true });
  }, [phase, navigate]);

  if (!questions.length || phase === 'setup' || phase === 'generating') return null;

  const question       = questions[currentIndex];
  const selectedAnswer = answers[question.id];
  const hasAnswered    = selectedAnswer !== undefined;
  const isLastQuestion = currentIndex === questions.length - 1;
  const answerData     = answerKey?.find((q) => q.id === question.id);
  const correctIndex   = answerData?.correctIndex;
  const explanation    = answerData?.explanation;

  const handleAnswer = (idx) => { if (!hasAnswered) answerQuestion(question.id, idx); };

  const handleNext = async () => {
    if (isLastQuestion) {
      const ok = await submitAnswers();
      if (ok) navigate('/results');
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ───────────────────────────────── */}
      <Sidebar
        variant="quiz"
        topic={topic}
        difficulty={difficulty}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
      />

      {/* ── Main content ─────────────────────────── */}
      <div className="content-area">
        <main className="main-content" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          {/* Progress */}
          <div style={{ marginBottom: '40px' }}>
            <ProgressBar current={currentIndex} total={questions.length} />
          </div>

          {/* Question card */}
          {/*
           * WRONG-ANSWER BUG FIX:
           * FeedbackBanner and the Continue button are rendered OUTSIDE the
           * answer options list. Previously they were siblings inside .stagger
           * which re-triggered CSS animations on all .stagger > * children
           * whenever they were added to the DOM. Now the options list is a
           * stable set of 4 items that never changes structure after render.
           */}
          <QuizCard key={question.id} question={question} questionIndex={currentIndex}>
            {/* Answer options — stable list, never re-mounts on answer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {question.options.map((option, idx) => (
                <AnswerOption
                  key={idx}
                  option={option}
                  index={idx}
                  isSelected={selectedAnswer === idx}
                  isCorrect={idx === correctIndex}
                  isRevealed={hasAnswered}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(idx)}
                />
              ))}
            </div>

            {/* Feedback — rendered outside the options list to avoid stagger re-trigger */}
            {hasAnswered && explanation != null && (
              <FeedbackBanner isCorrect={selectedAnswer === correctIndex} explanation={explanation} />
            )}

            {/* Next / Submit button */}
            {hasAnswered && (
              <div
                style={{
                  marginTop: '28px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  animation: 'var(--animate-fade-up)',
                }}
              >
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="btn-duo btn-duo-green"
                  type="button"
                  id="next-question-btn"
                  style={{ minWidth: '180px' }}
                >
                  {submitting ? (
                    <><Loader2 size={16} strokeWidth={2.5} style={{ animation: 'spin-slow 1s linear infinite' }} /> Submitting…</>
                  ) : isLastQuestion ? (
                    <><Trophy size={16} strokeWidth={2.5} /> See Results</>
                  ) : (
                    <>Continue <ChevronRight size={16} strokeWidth={2.5} /></>
                  )}
                </button>
              </div>
            )}
          </QuizCard>
        </main>
      </div>
    </div>
  );
}
