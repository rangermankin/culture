import React from 'react';

export default function EnjoymentScreen({ onAnswer }) {
  return (
    <div className="screen enjoyment-screen">
      <div className="enjoyment-inner">
        <p className="question-count">One last thing</p>
        <h2 className="question-text">
          How much did you enjoy this personality assessment?
        </h2>
        <div className="options-grid">
          <button
            className="option-card"
            onClick={() => onAnswer(true)}
          >
            A lot
          </button>
          <button
            className="option-card"
            onClick={() => onAnswer(false)}
          >
            Not at all
          </button>
        </div>
      </div>
    </div>
  );
}
