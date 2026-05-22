import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { AlertCircle } from 'lucide-react';
import '../styles/settings.css';

export const Settings: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPinSettings, setShowPinSettings] = useState(false);
  const [newPin, setNewPin] = useState('');
  const {
    isPinProtected,
    clearPin,
    deleteAllData,
    autoDeleteEnabled,
    autoDeleteFrequency,
    setAutoDelete,
  } = useAppStore();

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure? This will permanently delete all your data.')) {
      deleteAllData();
      setShowDeleteConfirm(false);
      alert('All data has been deleted');
    }
  };

  const handleRemovePin = () => {
    if (window.confirm('Remove PIN protection?')) {
      clearPin();
      alert('PIN protection removed');
    }
  };

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    useAppStore().setPinCode(newPin);
    setNewPin('');
    setShowPinSettings(false);
    alert('PIN updated successfully');
  };

  return (
    <div className="settings">
      <h2>Settings & Privacy</h2>

      <div className="settings-section">
        <h3>Security</h3>

        <div className="setting-item">
          <div className="setting-info">
            <label>PIN Protection</label>
            <p className="description">Protect your data with a PIN code</p>
          </div>
          {isPinProtected ? (
            <button
              onClick={handleRemovePin}
              className="danger-button"
            >
              Disable PIN
            </button>
          ) : (
            <button
              onClick={() => setShowPinSettings(!showPinSettings)}
              className="primary-button"
            >
              Enable PIN
            </button>
          )}
        </div>

        {showPinSettings && !isPinProtected && (
          <form onSubmit={handleSetPin} className="pin-form">
            <input
              type="password"
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              placeholder="Enter 4+ digit PIN"
              pattern="\d*"
              maxLength={6}
            />
            <button type="submit" className="primary-button">Set PIN</button>
          </form>
        )}
      </div>

      <div className="settings-section">
        <h3>Data Management</h3>

        <div className="setting-item">
          <div className="setting-info">
            <label>Auto-Delete Data</label>
            <p className="description">Automatically delete old tracking data</p>
          </div>
          <input
            type="checkbox"
            checked={autoDeleteEnabled}
            onChange={e => setAutoDelete(e.target.checked, autoDeleteFrequency)}
            className="checkbox"
          />
        </div>

        {autoDeleteEnabled && (
          <div className="setting-item">
            <label>Frequency</label>
            <select
              value={autoDeleteFrequency || 'monthly'}
              onChange={e => setAutoDelete(true, e.target.value as any)}
              className="select"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        <div className="setting-item danger">
          <div className="setting-info">
            <label>Delete All Data</label>
            <p className="description warning">
              <AlertCircle size={16} />
              This action cannot be undone
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="danger-button"
          >
            Delete All
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>About Euki</h3>
        <div className="about-info">
          <p><strong>Euki - Period Tracker</strong></p>
          <p>Version 1.0.0</p>
          <p>Privacy-first period and sexual health tracker for everyone.</p>
          <p className="privacy-statement">
            🔒 Your data is encrypted and stored locally on your device.
            We never collect, store, or share your personal health information.
          </p>
          <div className="links">
            <a href="#" className="link">Privacy Policy</a>
            <a href="#" className="link">Terms of Use</a>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="confirmation-dialog">
          <h3>Delete All Data?</h3>
          <p>This will permanently delete all your tracking data, appointments, and reminders.</p>
          <div className="button-group">
            <button onClick={handleDeleteAllData} className="danger-button">
              Delete Everything
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="secondary-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
