import { Brain, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const MESSAGES = [
  'Crafting your questions',
  'Consulting the AI oracle',
  'Generating brain teasers',
  'Polishing answer options',
  'Almost ready',
];

export default function LoadingState({ topic }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setMsgIndex((p) => (p + 1) % MESSAGES.length), 2500);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        padding: '40px',
        minHeight: '100vh',
      }}
    >
      {/* Animated icon stack */}
      <div style={{ position: 'relative', width: '96px', height: '96px' }}>
        {/* Outer spinner ring */}
        <div
          className="loading-spinner"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #E5E5E5',
            borderTopColor: '#58CC02',
          }}
        />
        {/* Brain icon centre */}
        <div
          className="loading-icon-wrap"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Brain size={44} color="#58CC02" strokeWidth={1.5} />
        </div>
      </div>

      {/* Message */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#3C3C3C',
            marginBottom: '8px',
            minHeight: '2rem',
          }}
        >
          {MESSAGES[msgIndex]}…
        </p>
        {topic && (
          <p style={{ color: '#777', fontSize: '1rem' }}>
            Topic:{' '}
            <span style={{ color: '#58CC02', fontWeight: 700 }}>{topic}</span>
          </p>
        )}
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === msgIndex % MESSAGES.length ? '24px' : '10px',
              height: '10px',
              borderRadius: '999px',
              background: i === msgIndex % MESSAGES.length ? '#58CC02' : '#E5E5E5',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', color: '#AFAFAF' }}>
        Usually takes 5–10 seconds
      </p>
    </div>
  );
}
