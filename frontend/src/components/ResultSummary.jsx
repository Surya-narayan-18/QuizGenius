import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Target, Dumbbell, BookOpen, Sparkles } from 'lucide-react';

function getScoreTier(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { Icon: Trophy,   title: 'Quiz Master!',     color: '#FFC800', bg: '#FFF5CC', border: '#E5A800' };
  if (pct >= 70) return { Icon: Target,   title: 'Solid Effort!',    color: '#58CC02', bg: '#D7FFB8', border: '#4CAD02' };
  if (pct >= 50) return { Icon: Dumbbell, title: 'Keep Going!',      color: '#1CB0F6', bg: '#D2F4FF', border: '#0B96D4' };
  return           { Icon: BookOpen,  title: 'Keep Practicing!', color: '#CE82FF', bg: '#F3E8FF', border: '#A560D8' };
}

export default function ResultSummary({ score, total, feedbackText }) {
  const tier = getScoreTier(score, total);
  const fired = useRef(false);

  useEffect(() => {
    if (score / total >= 0.7 && !fired.current) {
      fired.current = true;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#58CC02', '#FFC800', '#1CB0F6', '#CE82FF'] });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
      }, 400);
    }
  }, [score, total]);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0', animation: 'var(--animate-bounce-in)' }}>
      {/* Score ring */}
      <div
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: tier.bg,
          border: `6px solid ${tier.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: `0 0 0 8px ${tier.bg}`,
          gap: '4px',
        }}
      >
        <tier.Icon size={36} color={tier.color} strokeWidth={2} />
        <span style={{ fontWeight: 900, fontSize: '2rem', color: tier.color, lineHeight: 1.1 }}>
          {score}/{total}
        </span>
      </div>

      <h1 style={{ fontWeight: 900, fontSize: '2rem', color: '#3C3C3C', marginBottom: '8px' }}>
        {tier.title}
      </h1>
      <p style={{ color: '#777', fontSize: '1.1rem', marginBottom: '24px' }}>
        You got <strong style={{ color: tier.color }}>{score}</strong> out of{' '}
        <strong>{total}</strong> correct
      </p>

      {/* Feedback Card */}
      {feedbackText && (
        <div
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            background: 'white',
            border: '2px solid #E5E5E5',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            textAlign: 'left',
            animation: 'var(--animate-fade-up)',
            animationDelay: '0.1s',
            animationFillMode: 'both',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#F3E8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={20} color="#CE82FF" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#CE82FF', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Feedback
            </p>
            <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.5, fontWeight: 500 }}>
              {feedbackText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
