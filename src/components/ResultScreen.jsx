import React, { useState } from 'react';
import { books, bookOrder } from '../data/books';
import RadarChart from './RadarChart';
import { encodeResultToURL } from '../hooks/useQuiz';

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

function ShareOptions({ book, scores, topResult }) {
  const [textState, setTextState] = useState('idle');
  const [linkState, setLinkState] = useState('idle');
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const shareText = `I got "${book.title}" on the Culture novel quiz.\n\n"${book.matchReason.split('. ')[0]}."\n\nWhich Culture novel are you?`;

  async function handleNativeShare() {
    try {
      await navigator.share({ text: shareText });
    } catch {
      // user cancelled
    }
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      setTextState('copied');
      setTimeout(() => setTextState('idle'), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  async function handleCopyLink() {
    try {
      const url = encodeResultToURL(topResult, scores);
      await navigator.clipboard.writeText(url);
      setLinkState('copied');
      setTimeout(() => setLinkState('idle'), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="share-options">
      {hasNativeShare && (
        <button className="btn-share" onClick={handleNativeShare}>
          Share via&hellip;
        </button>
      )}
      <button className="btn-share" onClick={handleCopyText}>
        {textState === 'copied' ? 'Copied!' : 'Copy text'}
      </button>
      <button className="btn-share" onClick={handleCopyLink}>
        {linkState === 'copied' ? 'Link copied!' : 'Copy link'}
      </button>
    </div>
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

        <RadarChart scores={scores} />

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
          <ShareOptions book={book} scores={scores} topResult={topResult} />
          <button className="btn-secondary" onClick={onRestart}>
            Take it again
          </button>
        </div>
      </div>
    </div>
  );
}
