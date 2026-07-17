import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Target, Dumbbell, BookOpen } from 'lucide-react';

function getScoreTier(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { Icon: Trophy,   title: 'Quiz Master!',     color: '#FFC800', bg: '#FFF5CC', border: '#E5A800' };
  if (pct >= 70) return { Icon: Target,   title: 'Solid Effort!',    color: '#58CC02', bg: '#D7FFB8', border: '#4CAD02' };
  if (pct >= 50) return { Icon: Dumbbell, title: 'Keep Going!',      color: '#1CB0F6', bg: '#D2F4FF', border: '#0B96D4' };
  return           { Icon: BookOpen,  title: 'Keep Practicing!', color: '#CE82FF', bg: '#F3E8FF', border: '#A560D8' };
}

export default function ResultSummary({ score, total }) {
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
      <p style={{ color: '#777', fontSize: '1.1rem' }}>
        You got <strong style={{ color: tier.color }}>{score}</strong> out of{' '}
        <strong>{total}</strong> correct
      </p>
    </div>
  );
}
