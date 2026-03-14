import React from 'react';

export default function NotForYouScreen({ onSeeResults }) {
  return (
    <div className="screen not-for-you-screen">
      <div className="nfy-inner">
        <div className="nfy-icon">✕</div>
        <h2 className="nfy-title">The Culture Series is not for you.</h2>
        <p className="nfy-body">
          That's okay. Not every book belongs on every shelf, and not every
          personality quiz belongs in every inbox. We respect the honesty.
        </p>
        <p className="nfy-body">
          We'll spare you the full results.
        </p>
        <button className="nfy-peek" onClick={onSeeResults}>
          I still want to see my results
        </button>
      </div>
    </div>
  );
}
