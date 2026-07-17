export default function QuizCard({ question, questionIndex, children }) {
  return (
    <div key={questionIndex} style={{ animation: 'var(--animate-slide-right)' }}>
      {/* Question number */}
      <p
        style={{
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#777',
          marginBottom: '12px',
        }}
      >
        Question {questionIndex + 1}
      </p>

      {/* Question text */}
      <h2
        style={{
          fontWeight: 800,
          fontSize: '1.5rem',
          color: '#3C3C3C',
          lineHeight: 1.4,
          marginBottom: '28px',
        }}
      >
        {question.question}
      </h2>

      {children}
    </div>
  );
}
