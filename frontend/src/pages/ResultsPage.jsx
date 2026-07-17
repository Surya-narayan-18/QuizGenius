import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import ResultSummary from '../components/ResultSummary';
import LoadingState from '../components/LoadingState';
import Sidebar from '../components/Sidebar';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function ResultsPage() {
  const navigate = useNavigate();
  const { score, total, results, topic, difficulty, resetQuiz, retryTopic, phase, loading, feedbackText } = useQuizContext();

  useEffect(() => {
    if (phase !== 'results' && phase !== 'generating') navigate('/', { replace: true });
  }, [phase, navigate]);

  if (phase === 'generating') {
    return (
      <div className="app-shell">
        <Sidebar variant="loading" topic={topic} />
        <div className="content-area">
          <LoadingState topic={topic} />
        </div>
      </div>
    );
  }

  if (phase !== 'results' || !results) return null;

  const handleNewTopic = () => { resetQuiz(); navigate('/'); };
  const handleRetry    = async () => { const ok = await retryTopic(); if (ok) navigate('/quiz'); };

  return (
    <div className="app-shell">
      {/* ── Sidebar ───────────────────────────────── */}
      <Sidebar
        variant="results"
        topic={topic}
        difficulty={difficulty}
        score={score}
        total={total}
        onNewTopic={handleNewTopic}
        onRetry={handleRetry}
        retryLoading={loading}
      />

      {/* ── Main content ─────────────────────────── */}
      <div className="content-area">
        <main style={{ padding: '48px 56px', width: '100%', overflowY: 'auto' }}>
          {/* Score summary */}
          <ResultSummary score={score} total={total} feedbackText={feedbackText} />

          {/* Divider */}
          <div style={{ height: '2px', background: '#E5E5E5', margin: '40px 0' }} />

          {/* Question breakdown */}
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#3C3C3C', marginBottom: '20px' }}>
            Question Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map((r, idx) => (
              <article
                key={r.id}
                className="duo-card"
                style={{
                  padding: '20px 24px',
                  borderLeft: `5px solid ${r.isCorrect ? '#58CC02' : '#FF4B4B'}`,
                  borderRadius: '14px',
                  animation: 'var(--animate-fade-up)',
                  animationDelay: `${idx * 0.05}s`,
                  animationFillMode: 'both',
                  opacity: 0,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#3C3C3C', lineHeight: 1.5, flex: 1 }}>
                    <span style={{ color: '#AFAFAF', fontFamily: 'monospace', marginRight: '6px' }}>Q{idx + 1}.</span>
                    {r.question}
                  </h3>
                  <span
                    style={{
                      flexShrink: 0,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      background: r.isCorrect ? '#D7FFB8' : '#FFD2D2',
                      color: r.isCorrect ? '#4CAD02' : '#EA2B2B',
                      border: `2px solid ${r.isCorrect ? '#58CC02' : '#FF4B4B'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {r.isCorrect
                      ? <><CheckCircle2 size={13} strokeWidth={2.5} /> Correct</>
                      : <><XCircle size={13} strokeWidth={2.5} /> Wrong</>}
                  </span>
                </div>

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
                  {r.options.map((opt, oi) => {
                    const isRight    = oi === r.correctIndex;
                    const isUserPick = oi === r.selectedIndex;
                    const isWrong    = isUserPick && !r.isCorrect;
                    let bg     = 'transparent';
                    let color  = '#AFAFAF';
                    let border = '2px solid #E5E5E5';

                    if (isRight)  { bg = '#D7FFB8'; color = '#4CAD02'; border = '2px solid #58CC02'; }
                    if (isWrong)  { bg = '#FFD2D2'; color = '#EA2B2B'; border = '2px solid #FF4B4B'; }

                    return (
                      <div
                        key={oi}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: bg,
                          border,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.88rem',
                          color,
                          fontWeight: isRight || isWrong ? 700 : 500,
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: isRight ? '#58CC02' : isWrong ? '#FF4B4B' : '#E5E5E5',
                            color: isRight || isWrong ? 'white' : '#AFAFAF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {LETTERS[oi]}
                        </span>
                        <span style={{ flex: 1 }}>
                          {opt}
                          {isRight && <CheckCircle2 size={12} color="#4CAD02" strokeWidth={3} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />}
                          {isWrong && <XCircle size={12} color="#EA2B2B" strokeWidth={3} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div
                  style={{
                    background: '#F7F7F7',
                    border: '2px solid #E5E5E5',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    color: '#555',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <Lightbulb size={15} color="#FFC800" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{r.explanation}</span>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
