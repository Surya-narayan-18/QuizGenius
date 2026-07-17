import { Check, X } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerOption({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  disabled,
  onClick,
}) {
  let stateClass = '';
  let badgeStyle = { color: '#AFAFAF', borderColor: '#AFAFAF', background: 'transparent' };
  let trailingIcon = null;

  if (isRevealed) {
    if (isCorrect) {
      stateClass = 'correct';
      badgeStyle = { color: '#58CC02', borderColor: '#58CC02', background: '#D7FFB8' };
      trailingIcon = <Check size={18} color="#4CAD02" strokeWidth={3} style={{ flexShrink: 0, marginLeft: 'auto' }} />;
    } else if (isSelected) {
      stateClass = 'wrong';
      badgeStyle = { color: '#FF4B4B', borderColor: '#FF4B4B', background: '#FFD2D2' };
      trailingIcon = <X size={18} color="#EA2B2B" strokeWidth={3} style={{ flexShrink: 0, marginLeft: 'auto' }} />;
    } else {
      stateClass = 'dimmed';
    }
  } else if (isSelected) {
    stateClass = 'selected';
    badgeStyle = { color: '#1CB0F6', borderColor: '#1CB0F6', background: '#D2F4FF' };
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Option ${LETTERS[index]}: ${option}`}
      className={`answer-option stagger-item ${stateClass}`}
    >
      <span className="answer-badge" style={badgeStyle}>
        {LETTERS[index]}
      </span>
      <span style={{ lineHeight: 1.4, flex: 1 }}>{option}</span>
      {trailingIcon}
    </button>
  );
}
