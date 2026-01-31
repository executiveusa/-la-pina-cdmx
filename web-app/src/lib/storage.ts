import CryptoJS from 'crypto-js';
import type { TrackingEntry, Appointment, Reminder } from '../types';

const ENCRYPTION_KEY = 'euki-privacy-first-encryption-key';
const STORAGE_VERSION = 1;

interface StorageData {
  version: number;
  encrypted: boolean;
  data: string;
}

class SecureStorage {
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  saveTrackingEntry(entry: TrackingEntry): void {
    const entries = this.getTrackingEntries();
    entries[entry.date] = entry;
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      encrypted: true,
      data: this.encrypt(JSON.stringify(entries)),
    };
    localStorage.setItem('euki_tracking', JSON.stringify(storageData));
  }

  getTrackingEntries(): Record<string, TrackingEntry> {
    try {
      const stored = localStorage.getItem('euki_tracking');
      if (!stored) return {};

      const storageData: StorageData = JSON.parse(stored);
      const decrypted = this.decrypt(storageData.data);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error reading tracking entries:', e);
      return {};
    }
  }

  getTrackingEntry(date: string): TrackingEntry | null {
    const entries = this.getTrackingEntries();
    return entries[date] || null;
  }

  deleteAllData(): void {
    localStorage.removeItem('euki_tracking');
    localStorage.removeItem('euki_state');
    localStorage.removeItem('euki_appointments');
    localStorage.removeItem('euki_reminders');
    localStorage.removeItem('euki_bookmarks');
  }

  saveAppointments(appointments: Appointment[]): void {
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      encrypted: true,
      data: this.encrypt(JSON.stringify(appointments)),
    };
    localStorage.setItem('euki_appointments', JSON.stringify(storageData));
  }

  getAppointments(): Appointment[] {
    try {
      const stored = localStorage.getItem('euki_appointments');
      if (!stored) return [];

      const storageData: StorageData = JSON.parse(stored);
      const decrypted = this.decrypt(storageData.data);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error reading appointments:', e);
      return [];
    }
  }

  saveReminders(reminders: Reminder[]): void {
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      encrypted: true,
      data: this.encrypt(JSON.stringify(reminders)),
    };
    localStorage.setItem('euki_reminders', JSON.stringify(storageData));
  }

  getReminders(): Reminder[] {
    try {
      const stored = localStorage.getItem('euki_reminders');
      if (!stored) return [];

      const storageData: StorageData = JSON.parse(stored);
      const decrypted = this.decrypt(storageData.data);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Error reading reminders:', e);
      return [];
    }
  }

  saveBookmarks(bookmarks: string[]): void {
    localStorage.setItem('euki_bookmarks', JSON.stringify(bookmarks));
  }

  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem('euki_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading bookmarks:', e);
      return [];
    }
  }

  setPinCode(pin: string): void {
    const hashed = CryptoJS.SHA256(pin).toString();
    localStorage.setItem('euki_pin', hashed);
    localStorage.setItem('euki_pin_protected', 'true');
  }

  verifyPinCode(pin: string): boolean {
    const stored = localStorage.getItem('euki_pin');
    if (!stored) return false;
    const hashed = CryptoJS.SHA256(pin).toString();
    return hashed === stored;
  }

  isPinProtected(): boolean {
    return localStorage.getItem('euki_pin_protected') === 'true';
  }

  clearPin(): void {
    localStorage.removeItem('euki_pin');
    localStorage.removeItem('euki_pin_protected');
  }
}

export const storage = new SecureStorage();
