import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function FeedbackBanner({ isCorrect, isSkipped, explanation }) {
  const isWrong = !isCorrect && !isSkipped;
  
  let bgClass = '';
  if (isCorrect) bgClass = 'correct';
  else if (isWrong) bgClass = 'wrong';
  else if (isSkipped) bgClass = 'skipped'; // We'll add this class to index.css or just style inline

  let Icon = XCircle;
  let iconColor = '#EA2B2B';
  let title = 'Incorrect';
  let titleColor = '#EA2B2B';

  if (isCorrect) {
    Icon = CheckCircle2;
    iconColor = '#4CAD02';
    title = 'Correct! Great job!';
    titleColor = '#4CAD02';
  } else if (isSkipped) {
    Icon = MinusCircle;
    iconColor = '#777';
    title = 'Skipped / Time Out';
    titleColor = '#555';
  }

  return (
    <div 
      className="feedback-strip" 
      role="alert"
      style={{
        background: isCorrect ? '#D7FFB8' : isSkipped ? '#F7F7F7' : '#FFD2D2',
        border: `2px solid ${isCorrect ? '#58CC02' : isSkipped ? '#E5E5E5' : '#FF4B4B'}`,
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        <Icon size={28} color={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <p
          style={{
            fontWeight: 800,
            fontSize: '1rem',
            marginBottom: '4px',
            color: titleColor,
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: '0.92rem', color: '#3C3C3C', lineHeight: 1.5 }}>
          {explanation}
        </p>
      </div>
    </div>
  );
}
