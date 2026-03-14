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

// Resolve CSS custom properties in SVG attributes before html-to-image
// serialises the DOM — svg attributes like stroke="var(--border)" are not
// resolved by getComputedStyle and will silently produce blank/black output.
function inlineSvgVars(root) {
  const cs = getComputedStyle(document.documentElement);
  const ATTRS = ['stroke', 'fill', 'color', 'stop-color'];
  const backups = [];

  root.querySelectorAll('svg, svg *').forEach((el) => {
    ATTRS.forEach((attr) => {
      const val = el.getAttribute(attr);
      if (!val || !val.includes('var(')) return;
      const match = val.match(/var\((--[\w-]+)\)/);
      if (!match) return;
      const resolved = cs.getPropertyValue(match[1]).trim();
      if (resolved) {
        backups.push({ el, attr, val });
        el.setAttribute(attr, resolved);
      }
    });
    // Also handle font-family in text elements
    const ff = el.getAttribute('font-family');
    if (ff && ff.includes('var(')) {
      const match = ff.match(/var\((--[\w-]+)\)/);
      if (match) {
        const resolved = cs.getPropertyValue(match[1]).trim();
        if (resolved) {
          backups.push({ el, attr: 'font-family', val: ff });
          el.setAttribute('font-family', resolved.split(',')[0].replace(/['"]/g, '').trim());
        }
      }
    }
  });

  return () => backups.forEach(({ el, attr, val }) => el.setAttribute(attr, val));
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

    let restoreVars = null;
    try {
      await document.fonts.ready;

      // Inline CSS vars in SVG attributes so html-to-image can read them
      restoreVars = inlineSvgVars(imageRef.current);

      const cs = getComputedStyle(document.documentElement);
      const bgColor = cs.getPropertyValue('--bg-base').trim() || '#F2F6FC';

      const dataUrl = await toPng(imageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: bgColor,
        skipFonts: true,
      });

      restoreVars();
      restoreVars = null;

      const firstSentence = book.matchReason.split('. ')[0] + '.';
      const text = `I got "${book.title}" on the Culture novel quiz.\n\n${firstSentence}`;

      // Try native share with image file + link
      if (navigator.share && navigator.canShare) {
        const blob = await fetch(dataUrl).then((r) => r.blob());
        const file = new File([blob], 'culture-result.png', { type: 'image/png' });
        const shareData = {
          files: [file],
          title: 'My Culture novel result',
          text,
          url: shareUrl,
        };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setState('shared');
          setTimeout(() => setState('idle'), 2000);
          return;
        }
      }

      // Fallback for desktop: copy link (no silent download)
      await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
      setState('copied');
      setTimeout(() => setState('idle'), 2000);
    } catch (err) {
      if (restoreVars) restoreVars();
      // User cancelled the share sheet — not a real error
      if (err?.name === 'AbortError') {
        setState('idle');
        return;
      }
      console.error('Image share failed:', err);
      setState('failed');
      setTimeout(() => setState('idle'), 2500);
    }
  }

  const imageLabel =
    state === 'generating'
      ? 'Generating...'
      : state === 'shared'
      ? 'Shared'
      : state === 'copied'
      ? 'Copied'
      : state === 'failed'
      ? 'Failed'
      : 'Share image';

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

        {/* Capture target: card + radar */}
        <div
          ref={imageRef}
          className="share-card-target"
          style={{
            backgroundColor: 'var(--bg-base)',
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
