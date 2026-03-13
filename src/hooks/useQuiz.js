import { useState, useMemo } from 'react';
import { questions } from '../data/questions';
import { bookOrder } from '../data/books';

const initialScores = () =>
  Object.fromEntries(bookOrder.map((key) => [key, 0]));

// Encode result into a URL for sharing
export function encodeResultToURL(topResult, scores) {
  const params = new URLSearchParams();
  params.set('r', topResult);
  params.set('s', bookOrder.map((k) => `${k}:${scores[k]}`).join(','));
  const base = window.location.href.split('?')[0];
  return `${base}?${params.toString()}`;
}

// Decode result from URL params (returns null if not present/invalid)
function decodeResultFromURL() {
  const params = new URLSearchParams(window.location.search);
  const r = params.get('r');
  const s = params.get('s');
  if (!r || !s || !bookOrder.includes(r)) return null;
  try {
    const scores = Object.fromEntries(bookOrder.map((k) => [k, 0]));
    s.split(',').forEach((part) => {
      const [key, val] = part.split(':');
      if (scores[key] !== undefined) scores[key] = parseInt(val, 10) || 0;
    });
    return { topResult: r, scores };
  } catch {
    return null;
  }
}

export function useQuiz() {
  const fromURL = useMemo(() => decodeResultFromURL(), []);

  const [phase, setPhase] = useState(() => (fromURL ? 'result' : 'start'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(() => fromURL?.scores ?? initialScores());

  // Clear URL params after reading so restart doesn't re-trigger result
  useMemo(() => {
    if (fromURL && window.location.search) {
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

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
