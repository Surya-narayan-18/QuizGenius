import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import QuizCard from '../components/QuizCard';
import AnswerOption from '../components/AnswerOption';
import ProgressBar from '../components/ProgressBar';
import FeedbackBanner from '../components/FeedbackBanner';
import Sidebar from '../components/Sidebar';
import Timer from '../components/Timer';
import { ChevronRight, ChevronLeft, Trophy, Loader2, Target } from 'lucide-react';

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    questions, answerKey, currentIndex, answers, highestVisitedIndex, liveScore,
    answerQuestion, nextQuestion, goToQuestion, submitAnswers,
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

  const handleSkip = () => {
    if (!hasAnswered) answerQuestion(question.id, -1);
  };

  const isSkipped = selectedAnswer === -1;
  const isReviewing = currentIndex < highestVisitedIndex;
  const canGoNext = hasAnswered || isReviewing;
  const canGoPrev = currentIndex > 0;

  const handleNext = async () => {
    if (isLastQuestion) {
      if (!hasAnswered) return;
      const ok = await submitAnswers();
      if (ok) navigate('/results');
    } else if (isReviewing) {
      goToQuestion(currentIndex + 1);
    } else {
      nextQuestion();
    }
  };

  const handlePrev = () => {
    if (canGoPrev) goToQuestion(currentIndex - 1);
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ───────────────────────────────── */}
      <Sidebar
        variant="quiz"
        topic={topic}
        difficulty={difficulty}
        questions={questions}
        answerKey={answerKey}
        answers={answers}
        currentIndex={currentIndex}
        highestVisitedIndex={highestVisitedIndex}
        goToQuestion={goToQuestion}
      />

      {/* ── Main content ─────────────────────────── */}
      <div className="content-area">
        <main style={{ padding: '48px 56px', width: '100%', maxWidth: '900px' }}>
          {/* Progress and Score Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ flex: 1, maxWidth: '60%' }}>
              <ProgressBar current={currentIndex + 1} total={questions.length} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {!hasAnswered && (
                <Timer duration={30} onTimeUp={handleSkip} questionIndex={currentIndex} />
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#3C3C3C',
                  background: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '2px solid #E5E5E5',
                }}
              >
                <Target size={18} color="#1CB0F6" strokeWidth={2.5} />
                Score: <span style={{ color: '#1CB0F6', marginLeft: '4px' }}>{liveScore}</span> / {questions.length}
              </div>
            </div>
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
              <FeedbackBanner isCorrect={selectedAnswer === correctIndex} isSkipped={isSkipped} explanation={explanation} />
            )}

            {/* Next / Submit button */}
            {(canGoNext || canGoPrev || !hasAnswered) && (
              <div
                style={{
                  marginTop: '28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  animation: 'var(--animate-fade-up)',
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {canGoPrev && (
                    <button
                      onClick={handlePrev}
                      className="btn-duo"
                      style={{ background: 'transparent', color: '#777', border: '2px solid #E5E5E5', padding: '12px 18px' }}
                      type="button"
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} /> Previous
                    </button>
                  )}
                  {!hasAnswered && (
                    <button
                      onClick={handleSkip}
                      className="btn-duo"
                      style={{ background: '#F7F7F7', color: '#777', border: '2px solid #E5E5E5', padding: '12px 18px' }}
                      type="button"
                    >
                      Skip <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
                
                <div>
                  {canGoNext && (
                    <button
                      onClick={handleNext}
                      disabled={submitting || (isLastQuestion && !hasAnswered)}
                      className="btn-duo btn-duo-green"
                      type="button"
                      id="next-question-btn"
                      style={{ minWidth: '180px' }}
                    >
                      {submitting ? (
                        <><Loader2 size={16} strokeWidth={2.5} style={{ animation: 'spin-slow 1s linear infinite' }} /> Submitting…</>
                      ) : (isLastQuestion && !isReviewing) ? (
                        <><Trophy size={16} strokeWidth={2.5} /> See Results</>
                      ) : (
                        <>{isReviewing && !hasAnswered ? 'Next' : 'Continue'} <ChevronRight size={16} strokeWidth={2.5} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </QuizCard>
        </main>
      </div>
    </div>
  );
}
