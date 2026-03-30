import { useMemo, useRef, useState } from 'react';
import './LoginPage.css';

const PIN_LENGTH = 4;
const CORRECT_PIN = '1234';

function LoginPage({ onLoginSuccess, onGoToLicense }) {
  const [pinDigits, setPinDigits] = useState(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <button
          type="button"
          className="license-button"
          onClick={onGoToLicense}
        >
          License
        </button>

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
    </main>
  );
}

export default LoginPage;
