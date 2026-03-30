import { useMemo, useRef, useState } from 'react';
import './LoginPage.css';

const PIN_LENGTH = 4;
const CORRECT_PIN = '1234';

function LoginPage({ onLoginSuccess, onGoToLicense }) {
  const [pinDigits, setPinDigits] = useState(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '',
    databaseName: '',
    createPin: '',
  });
  const inputRefs = useRef([]);

  const pinValue = useMemo(() => pinDigits.join(''), [pinDigits]);
  const isComplete = pinDigits.every((digit) => digit !== '');

  const focusInput = (index) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const updateDigit = (index, value) => {
    const nextDigits = [...pinDigits];
    nextDigits[index] = value;
    setPinDigits(nextDigits);
  };

  const attemptUnlock = (candidatePin) => {
    if (candidatePin === CORRECT_PIN) {
      setError('');
      setSuccess(true);
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
      return;
    }

    setSuccess(false);
    setError('Incorrect PIN. Please try again.');
    setPinDigits(Array(PIN_LENGTH).fill(''));
    focusInput(0);
  };

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, '');

    if (!raw) {
      updateDigit(index, '');
      setError('');
      return;
    }

    const digit = raw[raw.length - 1];
    const nextDigits = [...pinDigits];
    nextDigits[index] = digit;
    setPinDigits(nextDigits);
    setError('');

    if (index < PIN_LENGTH - 1) {
      focusInput(index + 1);
    }

    if (nextDigits.every((value) => value !== '')) {
      attemptUnlock(nextDigits.join(''));
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (pinDigits[index]) {
        updateDigit(index, '');
        setError('');
        return;
      }

      if (index > 0) {
        event.preventDefault();
        updateDigit(index - 1, '');
        focusInput(index - 1);
        setError('');
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key === 'Enter' && isComplete) {
      event.preventDefault();
      handleUnlock();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);

    if (!pasted) {
      return;
    }

    const nextDigits = Array(PIN_LENGTH).fill('');
    pasted.split('').forEach((digit, idx) => {
      nextDigits[idx] = digit;
    });

    setPinDigits(nextDigits);
    setError('');

    const focusIndex = Math.min(pasted.length, PIN_LENGTH - 1);
    focusInput(focusIndex);

    if (nextDigits.every((value) => value !== '')) {
      attemptUnlock(nextDigits.join(''));
    }
  };

  const handleUnlock = () => {
    if (!isComplete) {
      return;
    }

    attemptUnlock(pinValue);
  };

  const openDbModal = () => {
    setIsDbModalOpen(true);
  };

  const closeDbModal = () => {
    setIsDbModalOpen(false);
  };

  const handleDbChange = (field, value) => {
    if (field === 'createPin') {
      const sanitized = value.replace(/\D/g, '').slice(0, 4);
      setDbConfig((prev) => ({ ...prev, createPin: sanitized }));
      return;
    }
    setDbConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDbConfig = () => {
    console.log('Database config saved:', dbConfig);
    closeDbModal();
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-top-actions">
          <button
            type="button"
            className="settings-button"
            onClick={openDbModal}
            aria-label="Database Settings"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z" />
              <path d="M19.1 14.2a7.3 7.3 0 0 0 .1-2.2l2-1.5-2-3.4-2.5.7a7.4 7.4 0 0 0-1.9-1.1L14.3 4h-4.6l-.5 2.7a7.4 7.4 0 0 0-1.9 1.1l-2.5-.7-2 3.4 2 1.5a7.3 7.3 0 0 0 .1 2.2l-2 1.5 2 3.4 2.5-.7a7.4 7.4 0 0 0 1.9 1.1l.5 2.7h4.6l.5-2.7a7.4 7.4 0 0 0 1.9-1.1l2.5.7 2-3.4-2-1.5z" />
            </svg>
          </button>

          <button
            type="button"
            className="license-button"
            onClick={onGoToLicense}
          >
            License
          </button>
        </div>

        <header className="login-header">
          <h1 id="login-title" className="brand-title">OpticHome</h1>
          <p className="brand-subtitle">Enter your PIN to access the system</p>
        </header>

        <div className="pin-section">
          <label className="pin-label" htmlFor="pin-0">PIN Code</label>
          <div className="pin-input-row" role="group" aria-label="PIN code input">
            {pinDigits.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                className="pin-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoComplete="off"
                autoFocus={index === 0}
                aria-label={`PIN digit ${index + 1}`}
                value={digit}
                onFocus={(event) => event.target.select()}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
              />
            ))}
          </div>
        </div>

        <button
          className="unlock-button"
          type="button"
          disabled={!isComplete}
          onClick={handleUnlock}
        >
          Unlock
        </button>

        {error && (
          <p className="feedback-message error-message" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="feedback-message success-message" role="status">
            Access granted.
          </p>
        )}

        <p className="helper-text">Secure local access for staff only</p>
      </section>

      {isDbModalOpen && (
        <div className="db-modal-overlay" role="presentation" onClick={closeDbModal}>
          <section
            className="db-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Database Configuration"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="db-modal-header">
              <h2 className="db-modal-title">
                <svg className="db-title-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <ellipse cx="12" cy="6.2" rx="6.4" ry="2.7" />
                  <path d="M5.6 6.2v6.6c0 1.5 2.9 2.7 6.4 2.7s6.4-1.2 6.4-2.7V6.2" />
                </svg>
                <span>Database Configuration</span>
              </h2>
              <button
                type="button"
                className="db-close-btn"
                onClick={closeDbModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="db-modal-body">
              <div className="db-grid-top">
                <label className="db-field">
                  <span>HOST SERVER</span>
                  <input
                    type="text"
                    value={dbConfig.host}
                    onChange={(event) => handleDbChange('host', event.target.value)}
                  />
                </label>

                <label className="db-field">
                  <span>PORT</span>
                  <input
                    type="text"
                    value={dbConfig.port}
                    onChange={(event) => handleDbChange('port', event.target.value)}
                  />
                </label>
              </div>

              <label className="db-field">
                <span>USERNAME</span>
                <input
                  type="text"
                  value={dbConfig.username}
                  onChange={(event) => handleDbChange('username', event.target.value)}
                />
              </label>

              <label className="db-field">
                <span>PASSWORD</span>
                <input
                  type="password"
                  placeholder="Leave empty if none"
                  value={dbConfig.password}
                  onChange={(event) => handleDbChange('password', event.target.value)}
                />
              </label>

              <label className="db-field">
                <span>DATABASE NAME</span>
                <input
                  type="text"
                  value={dbConfig.databaseName}
                  onChange={(event) =>
                    handleDbChange('databaseName', event.target.value)
                  }
                />
              </label>

              <label className="db-field">
                <span>CREATE PIN (4 DIGITS)</span>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="1234"
                  value={dbConfig.createPin}
                  onChange={(event) =>
                    handleDbChange('createPin', event.target.value)
                  }
                />
              </label>
            </div>

            <footer className="db-modal-actions">
              <button type="button" className="db-cancel-btn" onClick={closeDbModal}>
                Cancel
              </button>
              <button type="button" className="db-save-btn" onClick={handleSaveDbConfig}>
                Save &amp; Apply
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

export default LoginPage;
