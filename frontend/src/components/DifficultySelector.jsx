import { Leaf, Flame, Skull } from 'lucide-react';

const LEVELS = [
  { id: 'easy',   Icon: Leaf,  label: 'Easy' },
  { id: 'medium', Icon: Flame, label: 'Medium' },
  { id: 'hard',   Icon: Skull, label: 'Hard' },
];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontWeight: 800,
          fontSize: '0.85rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#777',
          marginBottom: '10px',
        }}
      >
        Difficulty
      </label>

      <div className="segment-control" role="radiogroup" aria-label="Difficulty level">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            role="radio"
            aria-checked={value === level.id}
            onClick={() => onChange(level.id)}
            className={`segment-btn ${value === level.id ? 'active' : ''}`}
          >
            <level.Icon size={15} strokeWidth={2.5} />
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
