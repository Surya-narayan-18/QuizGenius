import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import TopicSelector from '../components/TopicSelector';
import DifficultySelector from '../components/DifficultySelector';
import LoadingState from '../components/LoadingState';
import Sidebar from '../components/Sidebar';
import {
  Sparkles, Loader2, AlertTriangle, X,
  Brain, Zap, Shield, Clock,
  ArrowRight,
} from 'lucide-react';

/* ── Feature highlight card ──────────────────────────────────────────── */
function FeatureCard({ icon: Icon, iconColor, iconBg, title, description }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px 18px',
        background: 'white',
        border: '2px solid #E5E5E5',
        borderRadius: '14px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: '0.92rem', color: '#3C3C3C', marginBottom: '3px' }}>{title}</p>
        <p style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.45 }}>{description}</p>
      </div>
    </div>
  );
}

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
            padding: '40px 48px 48px 56px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* ── Hero banner — full width ──────────────────────────── */}
          <div
            style={{
              background: 'linear-gradient(135deg, #58CC02 0%, #3ea800 100%)',
              borderRadius: '20px',
              padding: '28px 36px',
              marginBottom: '32px',
              boxShadow: '0 6px 0 #2e7a00',
              position: 'relative',
              overflow: 'hidden',
              animation: 'var(--animate-fade-up)',
            }}
          >
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: '-28px', right: '-28px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', bottom: '-36px', right: '100px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', top: '50%', right: '36px', transform: 'translateY(-50%)', opacity: 0.15 }}>
              <Brain size={72} color="white" strokeWidth={1} />
            </div>

            <h1 style={{ fontWeight: 900, fontSize: '2.1rem', color: 'white', lineHeight: 1.1, marginBottom: '8px', position: 'relative' }}>
              Start a Quiz
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem', lineHeight: 1.5, position: 'relative', maxWidth: '520px' }}>
              Pick any topic, choose your difficulty, and let Groq AI generate a personalized quiz in seconds.
            </p>
          </div>

          {/* ── Two-column body ───────────────────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '28px',
              flex: 1,
              alignItems: 'start',
              animation: 'var(--animate-fade-up)',
              animationDelay: '0.05s',
              animationFillMode: 'both',
            }}
          >
            {/* ── LEFT COLUMN: form ────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Error banner */}
              {error && (
                <div
                  style={{
                    background: '#FFD2D2',
                    border: '2px solid #FF4B4B',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '20px',
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
                  <button onClick={clearError} type="button" aria-label="Dismiss error" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EA2B2B', display: 'flex' }}>
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Form card */}
              <div
                className="duo-card"
                style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}
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

            {/* ── RIGHT COLUMN: feature info ───────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* How it works */}
              <div
                style={{
                  background: 'white',
                  border: '2px solid #E5E5E5',
                  borderRadius: '16px',
                  padding: '20px 22px',
                  marginBottom: '4px',
                }}
              >
                <p style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#AFAFAF', marginBottom: '14px' }}>
                  How it works
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { n: '1', text: 'Type any topic or pick from suggestions' },
                    { n: '2', text: 'Set difficulty and number of questions' },
                    { n: '3', text: 'Groq AI generates your quiz instantly' },
                    { n: '4', text: 'Answer, get feedback, and see your score' },
                  ].map(({ n, text }) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: '#58CC02',
                          color: 'white',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {n}
                      </span>
                      <p style={{ fontSize: '0.88rem', color: '#555', fontWeight: 600, lineHeight: 1.4 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <FeatureCard
                icon={Zap}
                iconColor="#FFC800"
                iconBg="#FFF5CC"
                title="Instant Generation"
                description="Questions are AI-crafted in 5–10 seconds, unique every time."
              />
              <FeatureCard
                icon={Shield}
                iconColor="#1CB0F6"
                iconBg="#D2F4FF"
                title="Server-Side Scoring"
                description="Answers are signed and verified server-side — no cheating."
              />
              <FeatureCard
                icon={Brain}
                iconColor="#CE82FF"
                iconBg="#F3E8FF"
                title="Any Topic, Any Level"
                description="From quantum physics to 90s hip-hop — any subject, three difficulties."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
