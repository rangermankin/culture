import { useState, useMemo } from 'react';
import { questions } from '../data/questions';
import { bookOrder } from '../data/books';

const initialScores = () =>
  Object.fromEntries(bookOrder.map((key) => [key, 0]));

function decodeScoresFromUrl() {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('r');
  if (!encoded) return null;

  const pairs = encoded.split(',');
  if (!pairs.length) return null;

  const decoded = initialScores();
  let foundAtLeastOne = false;

  for (const pair of pairs) {
    const [key, rawValue] = pair.split(':');
    if (!key || rawValue == null) continue;
    if (!bookOrder.includes(key)) continue;

    const value = Number(rawValue);
    if (!Number.isFinite(value) || value < 0) continue;

    decoded[key] = value;
    foundAtLeastOne = true;
  }

  return foundAtLeastOne ? decoded : null;
}

function clearSharedResultUrl() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('r');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function useQuiz() {
  const sharedScores = decodeScoresFromUrl();

  const [phase, setPhase] = useState(sharedScores ? 'result' : 'start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(sharedScores || initialScores);

  const topResult = useMemo(() => {
    return bookOrder.reduce((best, key) =>
      scores[key] > scores[best] ? key : best
    );
  }, [scores]);

  function startQuiz() {
    clearSharedResultUrl();
    setScores(initialScores());
    setCurrentIndex(0);
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
    clearSharedResultUrl();
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
