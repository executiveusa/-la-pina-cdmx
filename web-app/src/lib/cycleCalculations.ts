import { addDays, differenceInDays, parseISO, format, isAfter, isBefore } from 'date-fns';
import type { TrackingEntry, CycleData, CycleStats } from '../types';

export class CycleCalculator {
  /**
   * Identifies periods from tracking data
   * A period is identified when bleeding is logged
   */
  static identifyPeriods(entries: Record<string, TrackingEntry>): CycleData[] {
    const periods: CycleData[] = [];
    const sortedDates = Object.keys(entries).sort();

    let currentPeriodStart: string | null = null;
    let lastBleedingDate: string | null = null;

    for (const date of sortedDates) {
      const entry = entries[date];

      if (entry.bleeding?.size) {
        // There's bleeding on this date
        if (!currentPeriodStart) {
          // Start a new period if more than 3 days since last bleeding
          if (lastBleedingDate) {
            const daysSinceLast = differenceInDays(
              parseISO(date),
              parseISO(lastBleedingDate)
            );
            if (daysSinceLast > 3) {
              currentPeriodStart = date;
            }
          } else {
            currentPeriodStart = date;
          }
        }
        lastBleedingDate = date;
      } else if (currentPeriodStart && lastBleedingDate) {
        // No bleeding on this date - check if period has ended
        const daysSinceLast = differenceInDays(parseISO(date), parseISO(lastBleedingDate));
        if (daysSinceLast > 1) {
          // Period has ended
          periods.push({
            id: currentPeriodStart,
            startDate: currentPeriodStart,
            endDate: lastBleedingDate,
            duration: differenceInDays(parseISO(lastBleedingDate), parseISO(currentPeriodStart)) + 1,
          });
          currentPeriodStart = null;
        }
      }
    }

    // Handle current ongoing period
    if (currentPeriodStart && lastBleedingDate) {
      periods.push({
        id: currentPeriodStart,
        startDate: currentPeriodStart,
        endDate: lastBleedingDate,
        duration: differenceInDays(parseISO(lastBleedingDate), parseISO(currentPeriodStart)) + 1,
      });
    }

    return periods;
  }

  /**
   * Calculates cycle statistics from identified periods
   */
  static calculateCycleStats(periods: CycleData[]): CycleStats {
    if (periods.length === 0) {
      return {
        averageCycleLength: 28,
        averagePeriodLength: 5,
        variation: 0,
        cycles: [],
      };
    }

    // Calculate cycle lengths (days between period starts)
    const cycleLengths: number[] = [];
    for (let i = 1; i < periods.length; i++) {
      const cycleLength = differenceInDays(
        parseISO(periods[i].startDate),
        parseISO(periods[i - 1].startDate)
      );
      cycleLengths.push(cycleLength);
    }

    // Calculate period lengths
    const periodLengths = periods
      .filter(p => p.duration)
      .map(p => p.duration!);

    const averageCycleLength =
      cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((a, b) => a + b) / cycleLengths.length)
        : 28;

    const averagePeriodLength =
      periodLengths.length > 0
        ? Math.round(periodLengths.reduce((a, b) => a + b) / periodLengths.length)
        : 5;

    // Calculate variation
    const variation =
      cycleLengths.length > 0
        ? Math.round(
            Math.sqrt(
              cycleLengths.reduce(
                (sum, length) => sum + Math.pow(length - averageCycleLength, 2),
                0
              ) / cycleLengths.length
            )
          )
        : 0;

    // Predict next period
    const lastPeriod = periods[periods.length - 1];
    const nextPredictedDate = addDays(
      parseISO(lastPeriod.startDate),
      averageCycleLength
    );

    return {
      averageCycleLength,
      averagePeriodLength,
      variation,
      nextPredictedDate: format(nextPredictedDate, 'yyyy-MM-dd'),
      cycles: periods,
    };
  }

  /**
   * Predicts the next 4 periods
   */
  static getPeriodPredictions(stats: CycleStats): CycleData[] {
    if (!stats.nextPredictedDate) return [];

    const predictions: CycleData[] = [];
    let currentDate = parseISO(stats.nextPredictedDate);

    for (let i = 0; i < 4; i++) {
      const startDate = currentDate;
      const endDate = addDays(startDate, stats.averagePeriodLength - 1);

      predictions.push({
        id: `predicted-${i}`,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        duration: stats.averagePeriodLength,
      });

      currentDate = addDays(startDate, stats.averageCycleLength);
    }

    return predictions;
  }

  /**
   * Get the current day of cycle
   */
  static getCurrentDayOfCycle(entries: Record<string, TrackingEntry>, today: string): number | null {
    const periods = this.identifyPeriods(entries);
    if (periods.length === 0) return null;

    const lastPeriod = periods[periods.length - 1];
    const lastPeriodStart = parseISO(lastPeriod.startDate);
    const todayDate = parseISO(today);

    const dayOfCycle = differenceInDays(todayDate, lastPeriodStart) + 1;

    // Check if we're beyond the predicted next cycle start
    const stats = this.calculateCycleStats(periods);
    if (stats.nextPredictedDate) {
      const nextCycleDate = parseISO(stats.nextPredictedDate);
      if (isAfter(todayDate, nextCycleDate)) {
        return null; // No active cycle
      }
    }

    return dayOfCycle > 0 ? dayOfCycle : null;
  }

  /**
   * Check if a date is in predicted period window
   */
  static isInPredictedPeriod(date: string, stats: CycleStats): boolean {
    if (!stats.nextPredictedDate) return false;

    const checkDate = parseISO(date);
    const nextPeriod = parseISO(stats.nextPredictedDate);
    const periodEnd = addDays(nextPeriod, stats.averagePeriodLength - 1);

    return (
      !isBefore(checkDate, nextPeriod) &&
      !isAfter(checkDate, periodEnd)
    );
  }
}
