import React, { useMemo, useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { books, bookOrder } from '../data/books';

const BOOK_THEMES = {
  cp:  { title: 'Consider Phlebas',     theme: 'Pragmatism',    cluster: 'Ethics' },
  pg:  { title: 'The Player of Games',  theme: 'Mastery',       cluster: 'Self' },
  uw:  { title: 'Use of Weapons',       theme: 'Identity',      cluster: 'Self' },
  ex:  { title: 'Excession',            theme: 'Wonder',        cluster: 'Encounter' },
  inv: { title: 'Inversions',           theme: 'Influence',     cluster: 'Ethics' },
  ltw: { title: 'Look to Windward',     theme: 'Memory',        cluster: 'Legacy' },
  mat: { title: 'Matter',               theme: 'Growth',        cluster: 'Encounter' },
  sd:  { title: 'Surface Detail',       theme: 'Justice',       cluster: 'Ethics' },
  ths: { title: 'The Hydrogen Sonata',  theme: 'Transcendence', cluster: 'Legacy' },
};

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

      if (navigator.share && navigator.canShare) {
        const blob = await fetch(dataUrl).then((r) => r.blob());
        const file = new File([blob], 'culture-result.png', { type: 'image/png' });
        const shareData = { files: [file], title: 'My Culture novel result', text, url: shareUrl };
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setState('shared');
          setTimeout(() => setState('idle'), 2000);
          return;
        }
      }

      const isLinux = /linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent);
      const blob = await fetch(dataUrl).then((r) => r.blob());

      if (!isLinux && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setState('copied');
        setTimeout(() => setState('idle'), 2000);
      } else {
        const link = document.createElement('a');
        link.download = 'culture-result.png';
        link.href = dataUrl;
        link.click();
        setState('downloaded');
        setTimeout(() => setState('idle'), 2000);
      }
    } catch (err) {
      if (restoreVars) restoreVars();
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
    state === 'generating' ? 'Generating...' :
    state === 'shared'     ? 'Shared' :
    state === 'copied'     ? 'Image copied' :
    state === 'downloaded' ? 'Downloaded' :
    state === 'failed'     ? 'Failed' :
    'Share image';

  return (
    <div className="result-radar-actions">
      <button className="btn-share" onClick={handleShare} type="button">
        {state === 'copied'      ? 'Copied message + link' :
         state === 'copied-link' ? 'Link copied' :
         state === 'shared'      ? 'Shared' :
         state === 'failed'      ? 'Share failed' :
         'Share result'}
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

export default function ResultScreen({ scores, topResult, onRestart, isViewingShared, onTakeQuiz }) {
  const book = books[topResult];
  const sorted = [...bookOrder].sort((a, b) => scores[b] - scores[a]);
  const maxScore = scores[sorted[0]];
  const imageRef = useRef(null);

  const [shipName, setShipName] = useState(null);
  const [shipClass, setShipClass] = useState(null);
  const [shipState, setShipState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      try {
        const ranked = [...bookOrder]
          .map((key) => ({ key, score: scores[key] ?? 0, ...BOOK_THEMES[key] }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        const profileLines = ranked
          .map((b, i) => `${i + 1}. ${b.theme} (${b.cluster} — ${b.title}), score: ${b.score}`)
          .join('\n');

        const res = await fetch('/api/generate-ship-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: profileLines }),
        });

        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setShipName(data.name);
        setShipClass(data.shipClass);
        setShipState('done');
      } catch (err) {
        console.error('Ship name generation failed:', err);
        if (!cancelled) setShipState('error');
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [scores]);

  const radarHeading = shipState === 'done' && shipName
    ? `${shipClass} "${shipName}"`
    : 'AI Mind Map';

  return (
    <div className="screen result-screen">
      <div className="result-inner">

        {isViewingShared && (
          <div className="shared-result-callout">
            <div>
              <p className="callout-eyebrow">Someone shared this with you</p>
              <p className="callout-message">This is their result. Which Culture novel are you?</p>
            </div>
            <button className="btn-take-quiz" onClick={onTakeQuiz} type="button">
              Take the quiz
            </button>
          </div>
        )}

        <div
          ref={imageRef}
          className="share-card-target"
          style={{ backgroundColor: 'var(--bg-base)', padding: '24px', borderRadius: '16px' }}
        >
          <div
            className="result-card"
            style={{ '--book-accent': book.accentColor, '--book-light': book.accentLight }}
          >
            <div className="result-stripe" />
            <div className="result-card-body">
              <p className="result-label">{isViewingShared ? 'Their result' : 'Your result'}</p>
              <h2 className="result-title">{book.title}</h2>
              <p className="result-year">{book.year}</p>
              <p className="result-description">{book.description}</p>
              <div className="result-divider" />
              <p className="result-match-heading">Why this is you</p>
              <p className="result-match">{book.matchReason}</p>
            </div>
          </div>

          <div className="result-radar-section" style={{ marginTop: '16px' }}>
            <RadarChart scores={scores} heading={radarHeading} />
          </div>
        </div>

        {shipState !== 'error' && (
          <div className="ship-name-card">
            <p className="ship-name-eyebrow">Your Culture ship name</p>
            {shipState === 'loading' ? (
              <div className="ship-name-loading">
                <div className="ship-name-pulse" />
                <div className="ship-name-pulse ship-name-pulse--short" />
              </div>
            ) : (
              <>
                <p className="ship-name-class">{shipClass}</p>
                <p className="ship-name-value">"{shipName}"</p>
              </>
            )}
          </div>
        )}

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
