import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import '../styles/pin.css';

interface PinProtectionProps {
  onAuthenticated: () => void;
}

export const PinProtection: React.FC<PinProtectionProps> = ({ onAuthenticated }) => {
  const [pin, setPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const { verifyPinCode, setPinCode, isPinProtected } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isPinProtected) {
      // Verify existing PIN
      if (verifyPinCode(pin)) {
        onAuthenticated();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    } else {
      // Setting new PIN
      if (!isSettingPin) {
        if (pin.length < 4) {
          setError('PIN must be at least 4 digits');
          return;
        }
        setIsSettingPin(true);
        setPin('');
      } else {
        if (pin !== confirmPin) {
          setError('PINs do not match');
          setPin('');
          setConfirmPin('');
          setIsSettingPin(false);
          return;
        }
        setPinCode(confirmPin);
        onAuthenticated();
      }
    }
  };

  return (
    <div className="pin-protection">
      <div className="pin-card">
        <h1>Euki</h1>
        <p className="subtitle">Privacy-First Period Tracker</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              {isPinProtected
                ? 'Enter PIN'
                : isSettingPin
                ? 'Confirm PIN'
                : 'Create PIN (4+ digits)'}
            </label>
            <input
              type="password"
              value={isSettingPin && !isPinProtected ? confirmPin : pin}
              onChange={e =>
                isSettingPin && !isPinProtected
                  ? setConfirmPin(e.target.value)
                  : setPin(e.target.value)
              }
              placeholder="••••••"
              className="pin-input"
              pattern="\d*"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            {isPinProtected
              ? 'Unlock'
              : isSettingPin
              ? 'Confirm'
              : 'Set PIN'}
          </button>

          {!isPinProtected && isSettingPin && (
            <button
              type="button"
              onClick={() => {
                setIsSettingPin(false);
                setPin('');
                setConfirmPin('');
              }}
              className="back-button"
            >
              Back
            </button>
          )}
        </form>

        <div className="privacy-notice">
          <p>🔒 Your data stays on your device. We don't collect or store any information.</p>
        </div>
      </div>
    </div>
  );
};
