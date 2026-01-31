import React, { useState } from 'react';
import { format, getDaysInMonth, startOfMonth, addMonths } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { CycleCalculator } from '../lib/cycleCalculations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/calendar.css';

interface CalendarProps {
  onSelectDate: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const trackingEntries = useAppStore(state => state.trackingEntries);
  const cycleStats = useAppStore(state => state.getCycleStats());

  const firstDay = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = firstDay.getDay();

  const handlePrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const renderDays = () => {
    const days = [];
    const today = format(new Date(), 'yyyy-MM-dd');

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = format(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
        'yyyy-MM-dd'
      );
      const entry = trackingEntries.get(dateStr);
      const isToday = dateStr === today;
      const inPredictedPeriod = CycleCalculator.isInPredictedPeriod(dateStr, cycleStats);

      let className = 'calendar-day';
      if (isToday) className += ' today';
      if (entry?.bleeding) className += ' bleeding';
      if (inPredictedPeriod) className += ' predicted-period';
      if (entry?.notes || entry?.emotions.length || entry?.symptoms.length) className += ' tracked';

      days.push(
        <div
          key={dateStr}
          className={className}
          onClick={() => onSelectDate(dateStr)}
          role="button"
          tabIndex={0}
        >
          <div className="day-number">{day}</div>
          {entry?.bleeding && <div className="bleeding-indicator">●</div>}
          {inPredictedPeriod && !entry?.bleeding && (
            <div className="predicted-indicator">◕</div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-button">
          <ChevronLeft size={20} />
        </button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={handleNextMonth} className="nav-button">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderDays()}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="bleeding-dot">●</div>
          <span>Tracked bleeding</span>
        </div>
        <div className="legend-item">
          <div className="predicted-dot">◕</div>
          <span>Predicted period</span>
        </div>
      </div>
    </div>
  );
};
