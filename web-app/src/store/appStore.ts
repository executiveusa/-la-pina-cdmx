import { create } from 'zustand';
import type { TrackingEntry, Appointment, Reminder, AppState, CycleStats } from '../types';
import { storage } from '../lib/storage';
import { CycleCalculator } from '../lib/cycleCalculations';

interface AppStore extends AppState {
  // Actions
  saveTrackingEntry: (entry: TrackingEntry) => void;
  getTrackingEntry: (date: string) => TrackingEntry | null;
  getCycleStats: () => CycleStats;
  saveAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: string) => void;
  saveReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  toggleBookmark: (contentId: string) => void;
  isBookmarked: (contentId: string) => boolean;
  setPinCode: (pin: string) => void;
  verifyPinCode: (pin: string) => boolean;
  clearPin: () => void;
  authenticate: () => void;
  logout: () => void;
  setAutoDelete: (enabled: boolean, frequency?: 'weekly' | 'monthly' | 'yearly') => void;
  deleteAllData: () => void;
  loadFromStorage: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  isPinProtected: false,
  isAuthenticated: false,
  autoDeleteEnabled: false,
  trackingEntries: new Map(),
  appointments: [],
  bookmarks: [],
  reminders: [],

  saveTrackingEntry: (entry: TrackingEntry) => {
    storage.saveTrackingEntry(entry);
    const entries = new Map(get().trackingEntries);
    entries.set(entry.date, entry);
    set({ trackingEntries: entries });
  },

  getTrackingEntry: (date: string) => {
    return get().trackingEntries.get(date) || null;
  },

  getCycleStats: () => {
    const entries = Object.fromEntries(get().trackingEntries);
    const periods = CycleCalculator.identifyPeriods(entries);
    return CycleCalculator.calculateCycleStats(periods);
  },

  saveAppointments: (appointments: Appointment[]) => {
    storage.saveAppointments(appointments);
    set({ appointments });
  },

  addAppointment: (appointment: Appointment) => {
    const current = get().appointments;
    const updated = [...current, appointment];
    get().saveAppointments(updated);
  },

  removeAppointment: (id: string) => {
    const updated = get().appointments.filter(a => a.id !== id);
    get().saveAppointments(updated);
  },

  saveReminders: (reminders: Reminder[]) => {
    storage.saveReminders(reminders);
    set({ reminders });
  },

  addReminder: (reminder: Reminder) => {
    const current = get().reminders;
    const updated = [...current, reminder];
    get().saveReminders(updated);
  },

  removeReminder: (id: string) => {
    const updated = get().reminders.filter(r => r.id !== id);
    get().saveReminders(updated);
  },

  toggleBookmark: (contentId: string) => {
    const current = get().bookmarks;
    const updated = current.includes(contentId)
      ? current.filter(b => b !== contentId)
      : [...current, contentId];
    storage.saveBookmarks(updated);
    set({ bookmarks: updated });
  },

  isBookmarked: (contentId: string) => {
    return get().bookmarks.includes(contentId);
  },

  setPinCode: (pin: string) => {
    storage.setPinCode(pin);
    set({ isPinProtected: true });
  },

  verifyPinCode: (pin: string) => {
    return storage.verifyPinCode(pin);
  },

  clearPin: () => {
    storage.clearPin();
    set({ isPinProtected: false, isAuthenticated: false });
  },

  authenticate: () => {
    set({ isAuthenticated: true });
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  setAutoDelete: (enabled: boolean, frequency?: 'weekly' | 'monthly' | 'yearly') => {
    localStorage.setItem('euki_auto_delete_enabled', JSON.stringify(enabled));
    if (frequency) {
      localStorage.setItem('euki_auto_delete_frequency', frequency);
    }
    set({
      autoDeleteEnabled: enabled,
      autoDeleteFrequency: frequency,
    });
  },

  deleteAllData: () => {
    storage.deleteAllData();
    set({
      trackingEntries: new Map(),
      appointments: [],
      bookmarks: [],
      reminders: [],
      isPinProtected: false,
      isAuthenticated: false,
    });
  },

  loadFromStorage: () => {
    const entries = new Map(
      Object.entries(storage.getTrackingEntries())
    );
    const appointments = storage.getAppointments();
    const reminders = storage.getReminders();
    const bookmarks = storage.getBookmarks();
    const isPinProtected = storage.isPinProtected();

    // Restore auto-delete settings
    const autoDeleteEnabled = localStorage.getItem('euki_auto_delete_enabled')
      ? JSON.parse(localStorage.getItem('euki_auto_delete_enabled')!)
      : false;
    const autoDeleteFrequency = localStorage.getItem('euki_auto_delete_frequency') as
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | null;

    set({
      trackingEntries: entries,
      appointments,
      reminders,
      bookmarks,
      isPinProtected,
      autoDeleteEnabled,
      autoDeleteFrequency: autoDeleteFrequency || undefined,
    });
  },
}));
