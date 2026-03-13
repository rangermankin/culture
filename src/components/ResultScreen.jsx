import React, { useState } from 'react';
import { books, bookOrder } from '../data/books';

function ScoreBar({ bookKey, score, maxScore }) {
  const book = books[bookKey];
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return (
    <div className="score-row">
      <span className="score-label">{book.title}</span>
      <div className="score-track">
        <div
          className="score-fill"
          style={{
            width: `${pct}%`,
            backgroundColor: book.accentColor,
          }}
        />
      </div>
      <span className="score-value">{score}</span>
    </div>
  );
}

function ShareButton({ book }) {
  const [state, setState] = useState('idle');

  async function handleShare() {
    const firstSentence = book.matchReason.split('. ')[0] + '.';
    const text = `I got "${book.title}" on the Culture novel quiz.\n\n"${firstSentence}"\n\nWhich Culture novel are you?`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setState('copied');
        setTimeout(() => setState('idle'), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  }

  return (
    <button className="btn-share" onClick={handleShare}>
      {state === 'copied' ? 'Copied to clipboard' : 'Share result'}
    </button>
  );
}

export default function ResultScreen({ scores, topResult, onRestart }) {
  const book = books[topResult];

  const sorted = [...bookOrder].sort((a, b) => scores[b] - scores[a]);
  const maxScore = scores[sorted[0]];

  return (
    <div className="screen result-screen">
      <div className="result-inner">
        <div
          className="result-card"
          style={{
            '--book-accent': book.accentColor,
            '--book-light': book.accentLight,
          }}
        >
          <div className="result-stripe" />
          <div className="result-card-body">
            <p className="result-label">Your result</p>
            <h2 className="result-title">{book.title}</h2>
            <p className="result-year">{book.year}</p>
            <p className="result-description">{book.description}</p>
            <div className="result-divider" />
            <p className="result-match-heading">Why this is you</p>
            <p className="result-match">{book.matchReason}</p>
          </div>
        </div>

        <div className="scores-section">
          <p className="scores-heading">All scores</p>
          <div className="scores-list">
            {sorted.map((key) => (
              <ScoreBar
                key={key}
                bookKey={key}
                score={scores[key]}
                maxScore={maxScore}
              />
            ))}
          </div>
        </div>

        <div className="result-actions">
          <ShareButton book={book} />
          <button className="btn-secondary" onClick={onRestart}>
            Take it again
          </button>
        </div>
      </div>
    </div>
  );
}
