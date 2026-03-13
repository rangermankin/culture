import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const {
    phase,
    currentIndex,
    scores,
    topResult,
    question,
    totalQuestions,
    startQuiz,
    selectAnswer,
    restart,
  } = useQuiz();

  return (
    <div className="app">
      {phase === 'start' && <StartScreen onStart={startQuiz} />}
      {phase === 'quiz' && question && (
        <QuizScreen
          question={question}
          questionIndex={currentIndex}
          total={totalQuestions}
          onSelect={selectAnswer}
          scores={scores}
        />
      )}
      {phase === 'result' && (
        <ResultScreen
          scores={scores}
          topResult={topResult}
          onRestart={restart}
        />
      )}
    </div>
  );
}
