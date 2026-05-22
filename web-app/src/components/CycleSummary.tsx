import React from 'react';
import { useAppStore } from '../store/appStore';
import { CycleCalculator } from '../lib/cycleCalculations';
import { format, parseISO } from 'date-fns';
import '../styles/cycle.css';

export const CycleSummary: React.FC = () => {
  const cycleStats = useAppStore(state => state.getCycleStats());

  const predictions = CycleCalculator.getPeriodPredictions(cycleStats);
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayOfCycle = CycleCalculator.getCurrentDayOfCycle(
    Object.fromEntries(useAppStore(state => state.trackingEntries)),
    today
  );

  return (
    <div className="cycle-summary">
      <div className="summary-card">
        <h2>Cycle Overview</h2>

        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">{cycleStats.averageCycleLength}</div>
            <div className="stat-label">Average Cycle</div>
            <div className="stat-unit">days</div>
          </div>

          <div className="stat">
            <div className="stat-value">{cycleStats.averagePeriodLength}</div>
            <div className="stat-label">Average Period</div>
            <div className="stat-unit">days</div>
          </div>

          <div className="stat">
            <div className="stat-value">±{cycleStats.variation}</div>
            <div className="stat-label">Variation</div>
            <div className="stat-unit">days</div>
          </div>

          {dayOfCycle && (
            <div className="stat highlight">
              <div className="stat-value">{dayOfCycle}</div>
              <div className="stat-label">Day of Cycle</div>
              <div className="stat-unit">today</div>
            </div>
          )}
        </div>
      </div>

      <div className="predictions-card">
        <h3>Next Periods</h3>
        <div className="predictions-list">
          {predictions.map((period, index) => (
            <div key={period.id} className="prediction-item">
              <div className="prediction-number">Period {index + 1}</div>
              <div className="prediction-dates">
                {format(parseISO(period.startDate), 'MMM d')} - {format(parseISO(period.endDate!), 'MMM d')}
              </div>
              <div className="prediction-duration">{period.duration} days</div>
            </div>
          ))}
        </div>
      </div>

      {cycleStats.cycles.length === 0 && (
        <div className="empty-state">
          <p>Start tracking your period to see cycle analysis</p>
        </div>
      )}
    </div>
  );
};
