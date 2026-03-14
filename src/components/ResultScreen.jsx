import React, { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { books, bookOrder } from '../data/books';
import RadarChart from './RadarChart';

function encodeScores(scores) {
  return bookOrder.map((key) => scores[key] ?? 0).join('.');
}

function buildShareUrl(scores) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('r', encodeScores(scores));
  return url.toString();
}

function ScoreBar({ bookKey, score, maxScore }) {
  const book = books[bookKey];
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="score-row">
      <span className="score-label">{book.title}</span>
      <div className="score-track">
        <div
          className="score-fill"
          style={{ width: `${pct}%`, backgroundColor: book.accentColor }}
        />
      </div>
      <span className="score-value">{score}</span>
    </div>
  );
}

function ShareButton({ book, scores, imageRef }) {
  const [state, setState] = useState('idle');
  const shareUrl = useMemo(() => buildShareUrl(scores), [scores]);

  async function copyLinkOnly() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setState('copied-link');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('failed');
      setTimeout(() => setState('idle'), 2500);
    }
  }

  async function handleShare() {
    const firstSentence = book.matchReason.split('. ')[0] + '.';
    const text = `I got "${book.title}" on the Culture novel quiz.\n\n${firstSentence}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Culture novel result', text, url: shareUrl });
        setState('shared');
        setTimeout(() => setState('idle'), 2000);
        return;
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('failed');
      setTimeout(() => setState('idle'), 2500);
    }
  }

  async function handleImageShare() {
    if (!imageRef?.current) return;
    setState('generating');

    try {
      const dataUrl = await toPng(imageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        // Ensure the capture element has an explicit background
        style: { borderRadius: '0' },
      });

      // Try Web Share API with file (works on iOS Safari, Android Chrome)
      if (navigator.share && navigator.canShare) {
        const blob = await fetch(dataUrl).then((r) => r.blob());
        const file = new File([blob], 'culture-result.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'My Culture novel result' });
          setState('image-shared');
          setTimeout(() => setState('idle'), 2000);
          return;
        }
      }

      // Fallback: trigger download
      const link = document.createElement('a');
      link.download = 'culture-result.png';
      link.href = dataUrl;
      link.click();
      setState('downloaded');
      setTimeout(() => setState('idle'), 2000);
    } catch (err) {
      console.error('Image capture failed:', err);
      setState('failed');
      setTimeout(() => setState('idle'), 2500);
    }
  }

  const imageLabel =
    state === 'generating'
      ? 'Generating...'
      : state === 'image-shared'
      ? 'Shared'
      : state === 'downloaded'
      ? 'Downloaded'
      : state === 'failed'
      ? 'Failed'
      : 'Download image';

  return (
    <div className="result-radar-actions">
      <button className="btn-share" onClick={handleShare} type="button">
        {state === 'copied'
          ? 'Copied message + link'
          : state === 'copied-link'
          ? 'Link copied'
          : state === 'shared'
          ? 'Shared'
          : state === 'failed'
          ? 'Share failed'
          : 'Share result'}
      </button>

      <button className="btn-secondary" onClick={copyLinkOnly} type="button">
        Copy link
      </button>

      <button
        className="btn-secondary"
        onClick={handleImageShare}
        disabled={state === 'generating'}
        type="button"
      >
        {imageLabel}
      </button>
    </div>
  );
}

export default function ResultScreen({ scores, topResult, onRestart }) {
  const book = books[topResult];
  const sorted = [...bookOrder].sort((a, b) => scores[b] - scores[a]);
  const maxScore = scores[sorted[0]];
  const imageRef = useRef(null);

  return (
    <div className="screen result-screen">
      <div className="result-inner">

        {/* ── Capture target: card + radar ── */}
        <div
          ref={imageRef}
          className="share-card-target"
          style={{
            backgroundColor: 'var(--bg)',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
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

          <div className="result-radar-section" style={{ marginTop: '16px' }}>
            <RadarChart scores={scores} />
          </div>
        </div>
        {/* ── end capture target ── */}

        <div className="scores-section">
          <p className="scores-heading">All scores</p>
          <div className="scores-list">
            {sorted.map((key) => (
              <ScoreBar key={key} bookKey={key} score={scores[key]} maxScore={maxScore} />
            ))}
          </div>
        </div>

        <div className="result-radar-section">
          <ShareButton book={book} scores={scores} imageRef={imageRef} />
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={onRestart} type="button">
            Take it again
          </button>
        </div>
      </div>
    </div>
  );
}
