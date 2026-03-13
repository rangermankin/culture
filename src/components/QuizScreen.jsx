import React from 'react';

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-track" aria-label={`Question ${current} of ${total}`}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function QuizScreen({ question, questionIndex, total, onSelect }) {
  return (
    <div className="screen quiz-screen">
      <ProgressBar current={questionIndex} total={total} />
      <div className="quiz-inner">
        <p className="question-count">
          {questionIndex + 1} <span>/ {total}</span>
        </p>
        <h2 className="question-text">{question.text}</h2>
        <div className="options-grid">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              className="option-card"
              onClick={() => onSelect(opt.weights)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
