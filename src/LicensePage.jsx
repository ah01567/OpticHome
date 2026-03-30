import { useState } from 'react';
import './LicensePage.css';

function LicensePage({ onActivate, onBackToLogin }) {
  const [activationCode, setActivationCode] = useState('');

  const handleActivate = () => {
    if (!activationCode.trim()) {
      return;
    }

    if (typeof onActivate === 'function') {
      onActivate();
    }
  };

  return (
    <main className="license-page">
      <section className="license-card" aria-labelledby="activation-title">
        <button type="button" className="back-button" onClick={onBackToLogin}>
          Back
        </button>

        <header className="license-header">
          <h1 id="activation-title" className="license-title">Product Activation</h1>
          <p className="license-subtitle">
            Please enter your activation code to complete installation
          </p>
        </header>

        <label className="license-label" htmlFor="activation-code">
          Activation License
        </label>
        <input
          id="activation-code"
          className="license-input"
          type="text"
          autoComplete="off"
          value={activationCode}
          onChange={(event) => setActivationCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleActivate();
            }
          }}
        />

        <button
          type="button"
          className="activate-button"
          onClick={handleActivate}
          disabled={!activationCode.trim()}
        >
          Activate
        </button>
      </section>
    </main>
  );
}

export default LicensePage;
