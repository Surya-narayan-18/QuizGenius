import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';

export default function FeedbackBanner({ isCorrect, explanation }) {
  return (
    <div className={`feedback-strip ${isCorrect ? 'correct' : 'wrong'}`} role="alert">
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        {isCorrect
          ? <CheckCircle2 size={28} color="#4CAD02" strokeWidth={2.5} />
          : <XCircle    size={28} color="#EA2B2B" strokeWidth={2.5} />}
      </div>
      <div>
        <p
          style={{
            fontWeight: 800,
            fontSize: '1rem',
            marginBottom: '4px',
            color: isCorrect ? '#4CAD02' : '#EA2B2B',
          }}
        >
          {isCorrect ? 'Correct! Great job!' : 'Incorrect'}
        </p>
        <p style={{ fontSize: '0.92rem', color: '#3C3C3C', lineHeight: 1.5 }}>
          {explanation}
        </p>
      </div>
    </div>
  );
}
