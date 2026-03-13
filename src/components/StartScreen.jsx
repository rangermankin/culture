import React from 'react';

export default function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <div className="start-inner">
        <p className="start-series">The Culture Series — Iain M. Banks</p>
        <h1 className="start-title">Which Culture Novel<br />Are You?</h1>
        <p className="start-tagline">
          Somewhere in ten thousand years of post-scarcity civilisation, among the Minds
          and mercenaries and the quietly extraordinary, there is a novel that fits
          the shape of how you think.
        </p>
        <p className="start-sub">17 questions. No wrong answers.</p>
        <button className="btn-primary" onClick={onStart}>
          Begin
        </button>
        <div className="start-footer">
          <span>9 possible results</span>
          <span className="dot">·</span>
          <span>1987 – 2012</span>
        </div>
      </div>
    </div>
  );
}
