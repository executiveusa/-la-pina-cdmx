export const BleedingSize = {
  Spotting: 'spotting',
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
} as const;

export type BleedingSizeType = typeof BleedingSize[keyof typeof BleedingSize];

export const BleedingProduct = {
  Pad: 'pad',
  Liner: 'liner',
  Tampon: 'tampon',
  Cup: 'cup',
  Disc: 'disc',
} as const;

export type BleedingProductType = typeof BleedingProduct[keyof typeof BleedingProduct];

export const Emotion = {
  Calm: 'calm',
  Stressed: 'stressed',
  Unmotivated: 'unmotivated',
  Sad: 'sad',
  Happy: 'happy',
  Irritable: 'irritable',
} as const;

export type EmotionType = typeof Emotion[keyof typeof Emotion];

export const BodySymptom = {
  Acne: 'acne',
  Bloating: 'bloating',
  Cramps: 'cramps',
  Cravings: 'cravings',
  Discharge: 'discharge',
  Fatigue: 'fatigue',
  Headache: 'headache',
  HighEnergy: 'highEnergy',
  Libido: 'libido',
  PelvicPain: 'pelvicPain',
  Tender: 'tender',
} as const;

export type BodySymptomType = typeof BodySymptom[keyof typeof BodySymptom];

export const ContraceptionPill = {
  Took: 'took',
  Missed: 'missed',
  Double: 'double',
} as const;

export type ContraceptionPillType = typeof ContraceptionPill[keyof typeof ContraceptionPill];

export const TestResult = {
  Positive: 'positive',
  Negative: 'negative',
} as const;

export type TestResultType = typeof TestResult[keyof typeof TestResult];

export interface TrackingEntry {
  date: string; // YYYY-MM-DD
  bleeding?: {
    size?: BleedingSizeType;
    products: BleedingProductType[];
  };
  emotions: EmotionType[];
  symptoms: BodySymptomType[];
  contraception?: {
    pill?: ContraceptionPillType;
    other?: string[];
  };
  sexualActivity?: {
    date: string;
    protection: boolean;
  };
  tests?: {
    sti?: TestResultType;
    pregnancy?: TestResultType;
  };
  appointments: Appointment[];
  notes?: string;
}

export interface Appointment {
  id: string;
  date: string;
  title: string;
  type: 'doctor' | 'other';
  alert?: 'day-before' | 'week-before';
}

export interface CycleData {
  id: string;
  startDate: string;
  endDate?: string;
  duration?: number;
}

export interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  variation: number;
  nextPredictedDate?: string;
  cycles: CycleData[];
}

export interface ContentItem {
  id: string;
  title: string;
  content?: string;
  children?: ContentItem[];
  icon?: string;
  link?: string;
}

export interface AppState {
  pinCode?: string;
  isPinProtected: boolean;
  isAuthenticated: boolean;
  autoDeleteEnabled: boolean;
  autoDeleteFrequency?: 'weekly' | 'monthly' | 'yearly';
  trackingEntries: Map<string, TrackingEntry>;
  appointments: Appointment[];
  bookmarks: string[];
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  enabled: boolean;
}
