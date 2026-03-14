import React from 'react';

export default function NotForYouScreen({ onSeeResults }) {
  return (
    <div className="screen not-for-you-screen">
      <div className="nfy-inner">
        <div className="nfy-icon">✕</div>
        <h2 className="nfy-title">The Culture Series is not for you.</h2>
        <p className="nfy-body">
          Don't take it personally. The books will feel a lot like this assessment so it's probably best to try something else.
        </p>
        <p className="nfy-body">
          We'll spare you the full results.
        </p>
        <button className="nfy-peek" onClick={onSeeResults}>
          Hmmm, let me see anyway. I'll determine that for myself (good choice!)
        </button>
      </div>
    </div>
  );
}
