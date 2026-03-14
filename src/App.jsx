import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import EnjoymentScreen from './components/EnjoymentScreen';
import NotForYouScreen from './components/NotForYouScreen';

export default function App() {
  const {
    phase,
    currentIndex,
    scores,
    topResult,
    question,
    totalQuestions,
    isViewingShared,
    startQuiz,
    selectAnswer,
    answerEnjoyment,
    goToResult,
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
      {phase === 'enjoyment' && (
        <EnjoymentScreen onAnswer={answerEnjoyment} />
      )}
      {phase === 'not-for-you' && (
        <NotForYouScreen onSeeResults={goToResult} />
      )}
      {phase === 'result' && (
        <ResultScreen
          scores={scores}
          topResult={topResult}
          onRestart={restart}
          isViewingShared={isViewingShared}
          onTakeQuiz={restart}
        />
      )}
    </div>
  );
}
