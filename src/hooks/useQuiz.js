import { useState, useMemo } from 'react';
import { questions } from '../data/questions';
import { bookOrder } from '../data/books';

const initialScores = () =>
  Object.fromEntries(bookOrder.map((key) => [key, 0]));

export function useQuiz() {
  const [phase, setPhase] = useState('start'); // 'start' | 'quiz' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(initialScores);

  const topResult = useMemo(() => {
    return bookOrder.reduce((best, key) =>
      scores[key] > scores[best] ? key : best
    );
  }, [scores]);

  function startQuiz() {
    setPhase('quiz');
  }

  function selectAnswer(weights) {
    const newScores = { ...scores };
    Object.entries(weights).forEach(([key, val]) => {
      if (newScores[key] !== undefined) {
        newScores[key] += val;
      }
    });
    setScores(newScores);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setCurrentIndex(nextIndex);
      setPhase('result');
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  function restart() {
    setPhase('start');
    setCurrentIndex(0);
    setScores(initialScores());
  }

  return {
    phase,
    currentIndex,
    scores,
    topResult,
    question: questions[currentIndex] ?? null,
    totalQuestions: questions.length,
    startQuiz,
    selectAnswer,
    restart,
  };
}
