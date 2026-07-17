/**
 * Shared Sidebar — used on every page/state so the sidebar structure
 * is identical across home, loading, quiz, and results screens.
 *
 * Props:
 *   variant: 'home' | 'quiz' | 'results'
 *   topic, difficulty, numQuestions — quiz metadata
 *   questions, answers, currentIndex — quiz progress (variant=quiz)
 *   score, total — result data (variant=results)
 *   onNewTopic, onRetry, retryLoading — result actions (variant=results)
 */

import {
  Brain,
  Infinity as InfinityIcon,
  Bot,
  List,
  CheckCircle2,
  Circle,
  Dot,
  Leaf,
  Flame,
  Skull,
  Trophy,
  Home,
  RefreshCw,
  BookOpen,
  Layers,
  Hash,
} from 'lucide-react';

/* ── Brand header (always visible) ───────────────────────────────────── */
function SidebarBrand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #58CC02 0%, #4CAD02 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 0 #3a9a00',
          flexShrink: 0,
        }}
      >
        <Brain size={24} color="white" strokeWidth={2.5} />
      </div>
      <div>
        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#3C3C3C', lineHeight: 1 }}>
          QuizGenius
        </h2>
        <p style={{ fontSize: '0.72rem', color: '#AFAFAF', fontWeight: 700, marginTop: '2px', letterSpacing: '0.04em' }}>
          AI-POWERED QUIZZES
        </p>
      </div>
    </div>
  );
}

/* ── Stat cards (home sidebar bottom) ─────────────────────────────────── */
function StatCard({ icon: Icon, iconColor, iconBg, label, value }) {
  return (
    <div
      style={{
        background: '#F7F7F7',
        border: '2px solid #E5E5E5',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <p style={{ fontSize: '0.72rem', color: '#AFAFAF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </p>
        <p style={{ fontSize: '0.88rem', color: '#3C3C3C', fontWeight: 800, marginTop: '1px' }}>{value}</p>
      </div>
    </div>
  );
}

/* ── Difficulty badge ─────────────────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    easy:   { Icon: Leaf,  color: '#58CC02', bg: '#D7FFB8', border: '#58CC02', label: 'Easy' },
    medium: { Icon: Flame, color: '#FFC800', bg: '#FFF5CC', border: '#FFC800', label: 'Medium' },
    hard:   { Icon: Skull, color: '#FF4B4B', bg: '#FFD2D2', border: '#FF4B4B', label: 'Hard' },
  };
  const d = map[level] || map.medium;
  return (
    <span
      style={{
        background: d.bg,
        color: d.color,
        border: `2px solid ${d.border}`,
        borderRadius: '999px',
        padding: '4px 12px',
        fontWeight: 800,
        fontSize: '0.82rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <d.Icon size={13} strokeWidth={2.5} />
      {d.label}
    </span>
  );
}

/* ── Info row (results sidebar) ───────────────────────────────────────── */
function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ borderBottom: '2px solid #E5E5E5', paddingBottom: '10px' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#AFAFAF', marginBottom: '2px' }}>
        {label}
      </p>
      <p style={{ fontWeight: 800, color: highlight ? '#58CC02' : '#3C3C3C', fontSize: '0.92rem', textTransform: 'capitalize' }}>
        {value}
      </p>
    </div>
  );
}

/* ── Divider ──────────────────────────────────────────────────────────── */
function SidebarDivider() {
  return <div style={{ height: '1px', background: '#E5E5E5', margin: '16px 0' }} />;
}

/* ── Section label ────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AFAFAF', marginBottom: '10px' }}>
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/* Main Sidebar export                                                    */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Sidebar({
  variant = 'home',
  topic,
  difficulty,
  numQuestions,
  questions = [],
  answers = {},
  currentIndex = 0,
  score,
  total,
  onNewTopic,
  onRetry,
  retryLoading,
}) {
  /* ── HOME variant ─────────────────────────────────────────────────── */
  if (variant === 'home') {
    return (
      <aside className="sidebar">
        <SidebarBrand />

        {/* Tagline */}
        <p style={{ fontSize: '0.88rem', color: '#777', lineHeight: 1.5, marginBottom: '20px' }}>
          Pick any topic and let Gemini AI generate a personalized quiz in seconds.
        </p>

        <SidebarDivider />

        {/* Feature stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StatCard
            icon={InfinityIcon}
            iconColor="#1CB0F6"
            iconBg="#D2F4FF"
            label="Topics Available"
            value="Unlimited"
          />
          <StatCard
            icon={Bot}
            iconColor="#CE82FF"
            iconBg="#F3E8FF"
            label="Powered by"
            value="Gemini AI"
          />
          <StatCard
            icon={List}
            iconColor="#58CC02"
            iconBg="#D7FFB8"
            label="Questions per Quiz"
            value="5 – 15"
          />
          <StatCard
            icon={Layers}
            iconColor="#FFC800"
            iconBg="#FFF5CC"
            label="Difficulty Modes"
            value="Easy · Medium · Hard"
          />
        </div>
      </aside>
    );
  }

  /* ── QUIZ variant ─────────────────────────────────────────────────── */
  if (variant === 'quiz') {
    return (
      <aside className="sidebar">
        <SidebarBrand />

        {/* Topic & difficulty */}
        <div style={{ marginBottom: '16px' }}>
          <SectionLabel>Topic</SectionLabel>
          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#3C3C3C', marginBottom: '14px' }}>{topic}</p>
          <SectionLabel>Difficulty</SectionLabel>
          <DifficultyBadge level={difficulty} />
        </div>

        <SidebarDivider />

        {/* Question list */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <SectionLabel>Questions</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {questions.map((q, i) => {
              const isDone    = answers[q.id] !== undefined;
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={q.id}
                  className={`sidebar-q-item ${isCurrent ? 'current' : isDone ? 'done' : 'upcoming'}`}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isCurrent ? '#1CB0F6' : isDone ? '#58CC02' : '#E5E5E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={14} color="white" strokeWidth={3} />
                      : isCurrent
                      ? <Dot size={14} color="white" strokeWidth={4} />
                      : <Circle size={14} color="#AFAFAF" strokeWidth={2} />}
                  </span>
                  <span style={{ fontSize: '0.83rem' }}>Q{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    );
  }

  /* ── RESULTS variant ──────────────────────────────────────────────── */
  if (variant === 'results') {
    return (
      <aside className="sidebar">
        <SidebarBrand />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <InfoRow label="Topic" value={topic} />
          <InfoRow label="Difficulty" value={difficulty} />
          <InfoRow label="Questions" value={`${total} total`} />
          <InfoRow label="Score" value={`${score} / ${total}`} highlight />
        </div>

        <SidebarDivider />

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onNewTopic}
            className="btn-duo btn-duo-green"
            type="button"
            id="new-topic-btn"
            style={{ width: '100%' }}
          >
            <Home size={16} strokeWidth={2.5} />
            New Topic
          </button>
          <button
            onClick={onRetry}
            disabled={retryLoading}
            className="btn-duo btn-duo-ghost"
            type="button"
            id="retry-btn"
            style={{ width: '100%' }}
          >
            <RefreshCw size={16} strokeWidth={2.5} />
            Retry
          </button>
        </div>
      </aside>
    );
  }

  /* ── LOADING / default variant ────────────────────────────────────── */
  return (
    <aside className="sidebar">
      <SidebarBrand />
      {topic && (
        <div style={{ marginTop: '8px' }}>
          <SectionLabel>Generating quiz for</SectionLabel>
          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#3C3C3C' }}>{topic}</p>
        </div>
      )}
    </aside>
  );
}
