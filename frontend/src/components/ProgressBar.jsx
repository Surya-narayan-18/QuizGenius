import { Zap } from 'lucide-react';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Bar */}
      <div className="progress-track" style={{ flex: 1 }}>
        <div
          className="progress-fill"
          style={{ width: `${Math.max(progress, 2)}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>

      {/* XP counter */}
      <div className="xp-pill">
        <Zap size={14} color="#E5A800" strokeWidth={2.5} fill="#E5A800" />
        {current}/{total}
      </div>
    </div>
  );
}
