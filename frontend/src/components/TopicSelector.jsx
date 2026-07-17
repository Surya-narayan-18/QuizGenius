import {
  FlaskConical,
  BookMarked,
  Clapperboard,
  Code2,
  Rocket,
  Medal,
  Music,
  Smartphone,
  X,
} from 'lucide-react';

const SUGGESTIONS = [
  { Icon: FlaskConical,  label: 'Science',  value: 'Science' },
  { Icon: BookMarked,    label: 'History',  value: 'History' },
  { Icon: Clapperboard,  label: 'Movies',   value: 'Movies' },
  { Icon: Code2,         label: 'Coding',   value: 'Coding' },
  { Icon: Rocket,        label: 'Space',    value: 'Space' },
  { Icon: Medal,         label: 'Sports',   value: 'Sports' },
  { Icon: Music,         label: 'Music',    value: 'Music' },
  { Icon: Smartphone,    label: 'Tech',     value: 'Tech' },
];

export default function TopicSelector({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="topic-input"
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
        Topic
      </label>

      {/* Text input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <input
          id="topic-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type any topic — e.g. 'Quantum Physics', '90s Hip Hop'…"
          autoComplete="off"
          style={{
            width: '100%',
            padding: '14px 44px 14px 16px',
            border: '2.5px solid #AFAFAF',
            borderRadius: '12px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '1rem',
            color: '#3C3C3C',
            background: 'white',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#1CB0F6')}
          onBlur={(e) => (e.target.style.borderColor = '#AFAFAF')}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear topic"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#AFAFAF',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Suggestion chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="group" aria-label="Topic suggestions">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={value === s.value ? 'topic-chip topic-chip-active' : 'topic-chip topic-chip-inactive'}
          >
            <s.Icon size={13} strokeWidth={2.5} />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
