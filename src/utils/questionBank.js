export const QUESTION_BANK = {
  "Math": [
    { question: "What is the derivative of x^2?", answer: "2x" },
    { question: "What is 15% of 200?", answer: "30" },
    { question: "What is the square root of 144?", answer: "12" },
    { question: "Solve for x: 2x + 5 = 15", answer: "5" },
    { question: "What is the value of pi to two decimal places?", answer: "3.14" },
    { question: "What is 8 cubed?", answer: "512" },
    { question: "What is the integral of 2x dx?", answer: "x^2" },
    { question: "Evaluate: 7 × 8", answer: "56" },
  ],
  "Physics": [
    { question: "What is the standard unit of force?", answer: "newton" },
    { question: "What is the speed of light in vacuum (approx m/s)?", answer: "300000000" },
    { question: "F = m × ?", answer: "a" },
    { question: "What is the acceleration due to gravity on Earth (m/s^2)?", answer: "9.8" },
    { question: "What energy is associated with motion?", answer: "kinetic" },
    { question: "What particle has a negative charge?", answer: "electron" },
    { question: "What does temperature measure the average of?", answer: "kinetic energy" },
  ],
  "Chemistry": [
    { question: "What is the chemical symbol for Gold?", answer: "Au" },
    { question: "What is the pH of pure water at 25°C?", answer: "7" },
    { question: "Na + Cl forms what common compound?", answer: "NaCl" },
    { question: "How many protons are in Carbon?", answer: "6" },
    { question: "What is the lightest element?", answer: "hydrogen" },
    { question: "What gas do plants absorb from the atmosphere?", answer: "carbon dioxide" },
    { question: "What is the most abundant gas in Earth's atmosphere?", answer: "nitrogen" },
  ]
};

/**
 * Fallback questions if subject is custom and missing from the bank.
 */
export const FALLBACK_QUESTIONS = [
  { question: "What is 12 + 15?", answer: "27" },
  { question: "How many hours are in 3 days?", answer: "72" },
  { question: "What is 9 × 9?", answer: "81" },
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "Spell the word 'Focus' backwards.", answer: "sucof" }
];

export function getRandomQuestion(subject) {
  const bank = QUESTION_BANK[subject] || FALLBACK_QUESTIONS;
  const randomIndex = Math.floor(Math.random() * bank.length);
  return bank[randomIndex];
}
