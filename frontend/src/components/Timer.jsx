import { useState, useEffect, useRef } from 'react';
import { Clock, AlarmClock } from 'lucide-react';

export default function Timer({ duration = 30, onTimeUp, questionIndex }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(intervalRef.current); onTimeUp?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [questionIndex, duration, onTimeUp]);

  const isLow = timeLeft <= 5;
  const color = isLow ? '#FF4B4B' : '#1CB0F6';
  const Icon  = isLow ? AlarmClock : Clock;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: isLow ? '#FFD2D2' : '#D2F4FF',
        border: `2px solid ${color}`,
        borderRadius: '999px',
        padding: '6px 16px',
      }}
      aria-label={`${timeLeft} seconds remaining`}
    >
      <Icon size={16} color={color} strokeWidth={2.5} />
      <span
        style={{
          fontWeight: 800,
          fontSize: '1rem',
          color,
          minWidth: '32px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
