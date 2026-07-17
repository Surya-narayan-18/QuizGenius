import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import TopicSelector from '../components/TopicSelector';
import DifficultySelector from '../components/DifficultySelector';
import LoadingState from '../components/LoadingState';
import Sidebar from '../components/Sidebar';
import { Sparkles, Loader2, AlertTriangle, X } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    topic, setTopic,
    difficulty, setDifficulty,
    numQuestions, setNumQuestions,
    startQuiz, loading, error, clearError, phase,
  } = useQuizContext();

  const handleStart = async () => {
    const ok = await startQuiz();
    if (ok) navigate('/quiz');
  };

  /* ── Loading / generating state ─────────────────────────────────── */
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

  /* ── Normal setup state ──────────────────────────────────────────── */
  return (
    <div className="app-shell">
      <Sidebar variant="home" />

      <div className="content-area">
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '48px 48px 48px 64px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              animation: 'var(--animate-fade-up)',
            }}
          >
            {/* ── Page hero ───────────────────────────────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #58CC02 0%, #4CAD02 100%)',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '32px',
                boxShadow: '0 6px 0 #3a9a00',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circle */}
              <div
                style={{
                  position: 'absolute',
                  top: '-24px',
                  right: '-24px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-32px',
                  right: '64px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                }}
              />
              <h1
                style={{
                  fontWeight: 900,
                  fontSize: '2rem',
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                Start a Quiz
              </h1>
              <p
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  position: 'relative',
                }}
              >
                Pick any topic, choose your difficulty, and let AI do the rest.
              </p>
            </div>

            {/* ── Error banner ─────────────────────────────────────── */}
            {error && (
              <div
                style={{
                  background: '#FFD2D2',
                  border: '2px solid #FF4B4B',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                role="alert"
              >
                <AlertTriangle size={20} color="#EA2B2B" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#EA2B2B', fontSize: '0.95rem' }}>{error}</p>
                  <button
                    onClick={clearError}
                    type="button"
                    style={{ color: '#EA2B2B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, marginTop: '4px', padding: 0 }}
                  >
                    Dismiss
                  </button>
                </div>
                <button
                  onClick={clearError}
                  type="button"
                  aria-label="Dismiss error"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EA2B2B', display: 'flex' }}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* ── Form card ────────────────────────────────────────── */}
            <div
              className="duo-card"
              style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
              <TopicSelector value={topic} onChange={setTopic} />
              <DifficultySelector value={difficulty} onChange={setDifficulty} />

              {/* Question count */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#777',
                    marginBottom: '12px',
                  }}
                >
                  <span>Number of Questions</span>
                  <span
                    style={{
                      background: '#D7FFB8',
                      border: '2px solid #58CC02',
                      borderRadius: '999px',
                      padding: '3px 14px',
                      color: '#4CAD02',
                      fontWeight: 900,
                      fontSize: '1rem',
                    }}
                  >
                    {numQuestions}
                  </span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                  aria-label="Number of questions"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#AFAFAF', marginTop: '6px' }}>
                  <span>5</span><span>10</span><span>15</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleStart}
                disabled={!topic.trim() || loading}
                className="btn-duo btn-duo-green"
                type="button"
                id="start-quiz-btn"
                style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}
              >
                {loading
                  ? <><Loader2 size={18} strokeWidth={2.5} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating…</>
                  : <><Sparkles size={18} strokeWidth={2.5} /> Start Quiz</>}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
