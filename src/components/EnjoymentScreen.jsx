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
        <p style={{ marginTop: '24px', fontSize: '0.78rem', opacity: 0.45, fontStyle: 'italic', textAlign: 'center', maxWidth: '420px', margin: '24px auto 0' }}>
          The Number After Which There Is No Number will factor your answer into calculations you are not equipped to follow.
        </p>
      </div>
    </div>
  );
}
