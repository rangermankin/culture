import React from 'react';
import { bookOrder, books } from '../data/books';
import RadarChart from './RadarChart';

export default function ResultScreen({ scores, restart }) {

  const sorted = [...bookOrder]
    .map((key) => ({
      key,
      title: books[key].title,
      score: scores[key] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const top = sorted[0];

  return (
    <div className="result-screen">

      <h2>Your Culture Novel Match</h2>

      <div className="top-result">
        <h3>{top.title}</h3>
        <p className="result-score">
          Score: {top.score}
        </p>
      </div>

      <div className="result-list">
        {sorted.map((item) => (
          <div key={item.key} className="result-row">
            <span className="result-title">
              {item.title}
            </span>
            <span className="result-value">
              {item.score}
            </span>
          </div>
        ))}
      </div>

      {/* Radar chart added at the end */}

      <div className="result-chart">
        <RadarChart scores={scores} />
      </div>

      <div className="result-actions">
        <button onClick={restart}>
          Take Quiz Again
        </button>
      </div>

    </div>
  );
}
