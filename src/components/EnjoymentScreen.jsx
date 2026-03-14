import React from 'react';

export default function EnjoymentScreen({ onAnswer }) {
  return (
    <div className="screen enjoyment-screen">
      <div className="enjoyment-inner">
        <p className="question-count">One last thing</p>
        <h2 className="question-text">
          Thank you for taking the time complete this assessment. How much did you enjoy the expereince?
        </h2>
        <div className="options-grid">
          <button
            className="option-card"
            onClick={() => onAnswer(true)}
          >
            It was deeply engageing and I feel I've grown by participating.
          </button>
          <button
            className="option-card"
            onClick={() => onAnswer(false)}
          >
            Certainly not my cup of tea...
          </button>
        </div>
      </div>
    </div>
  );
}
