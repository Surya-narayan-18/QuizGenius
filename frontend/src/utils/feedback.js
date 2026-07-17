const FEEDBACK_BANK = {
  mastery: [
    "Incredible work! You've clearly mastered {topic}. Getting {percentage}% correct is no small feat.",
    "Flawless performance! Your knowledge of {topic} is truly impressive. Keep up the amazing work!",
    "You crushed it! A {percentage}% on {topic} shows you really know your stuff.",
    "Outstanding! You've got a rock-solid grasp on {topic}. Take a bow!"
  ],
  strong: [
    "Great job! You have a very strong understanding of {topic}. You scored {percentage}%, which is excellent.",
    "Solid effort! You're getting a strong handle on {topic} — {percentage}% correct!",
    "Well done! Your {topic} skills are looking sharp. Just a few more tweaks to reach perfection.",
    "You really know your way around {topic}. A {percentage}% is a fantastic result!"
  ],
  solid: [
    "Not bad at all! You have a solid foundation in {topic}, scoring {percentage}%. Keep learning!",
    "Good effort! You got {percentage}% correct. With a bit more practice, you'll be a {topic} expert.",
    "You're on the right track with {topic}! Review the answers to see where you can improve next time.",
    "A respectable {percentage}%! You clearly know some {topic}, but there's still room to grow."
  ],
  needsPractice: [
    "You're getting there! A {percentage}% shows you have some familiarity with {topic}, but keep practicing.",
    "Good try! {topic} can be tricky. Review your missed questions and you'll do better next time.",
    "Every expert was once a beginner! A {percentage}% on {topic} is just a stepping stone.",
    "Keep at it! You're learning more about {topic} with every attempt."
  ],
  keepLearning: [
    "Don't give up! {topic} is a tough subject. Review the explanations to build your knowledge.",
    "A challenging quiz, but that's how we learn! Keep studying {topic} and try again later.",
    "Every wrong answer is a chance to learn something new about {topic}. Keep going!",
    "It looks like {topic} is a new area for you. Don't worry, practice makes progress!"
  ]
};

function getBracket(percentage) {
  if (percentage >= 90) return 'mastery';
  if (percentage >= 70) return 'strong';
  if (percentage >= 50) return 'solid';
  if (percentage >= 30) return 'needsPractice';
  return 'keepLearning';
}

/**
 * Generates a personalized static feedback message based on score and topic.
 */
export function generateFeedback(score, total, topic) {
  const percentage = Math.round((score / total) * 100);
  const bracket = getBracket(percentage);
  const options = FEEDBACK_BANK[bracket];
  
  // Pick a random message from the bracket
  const template = options[Math.floor(Math.random() * options.length)];
  
  // Replace placeholders
  return template
    .replace(/{topic}/g, topic)
    .replace(/{percentage}/g, percentage);
}
