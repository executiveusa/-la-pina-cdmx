import { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { format } from 'date-fns';
import { useAppStore } from './store/appStore';
import { PinProtection } from './components/PinProtection';
import { Calendar } from './components/Calendar';
import { TrackingForm } from './components/TrackingForm';
import { CycleSummary } from './components/CycleSummary';
import { EducationalContent } from './components/EducationalContent';
import { Settings } from './components/Settings';
import './App.css';
import { Home, Calendar as CalendarIcon, BookOpen, Settings as SettingsIcon, LogOut } from 'lucide-react';

type Tab = 'home' | 'calendar' | 'track' | 'info' | 'settings';

function App() {
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const isPinProtected = useAppStore(s => s.isPinProtected);
  const authenticate = useAppStore(s => s.authenticate);
  const logout = useAppStore(s => s.logout);
  const loadFromStorage = useAppStore(s => s.loadFromStorage);

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    loadFromStorage();
    setIsHydrated(true);
  }, [loadFromStorage]);

  // Authenticate first-time users after hydration
  useEffect(() => {
    if (isHydrated && !isAuthenticated && !isPinProtected) {
      authenticate();
    }
  }, [isHydrated, isAuthenticated, isPinProtected, authenticate]);

  // Show PIN screen while loading or if PIN is required
  if (!isHydrated || (!isAuthenticated && isPinProtected)) {
    return isHydrated ? (
      <PinProtection onAuthenticated={() => authenticate()} />
    ) : null;
  }

  const getTodayDateString = () => format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Euki</h1>
          <p className="app-subtitle">Period Tracker</p>
        </div>
        <button onClick={() => logout()} className="logout-button" title="Logout">
          <LogOut size={20} />
        </button>
      </header>

      <main className="app-main">
        {activeTab === 'home' && <CycleSummary />}
        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <Calendar onSelectDate={(date) => {
              setSelectedDate(date);
              setActiveTab('track');
            }} />
          </div>
        )}
        {activeTab === 'track' && selectedDate && (
          <div className="track-view">
            <h2>Track for {format(parseISO(selectedDate), 'PPP')}</h2>
            <h2>Track for {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}</h2>
            <TrackingForm
              key={selectedDate}
              date={selectedDate}
              onSave={() => setActiveTab('home')}
            />
          </div>
        )}
        {activeTab === 'info' && <EducationalContent />}
        {activeTab === 'settings' && <Settings />}
      </main>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          title="Home"
        >
          <Home size={24} />
          <span>Cycle</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
          title="Calendar"
        >
          <CalendarIcon size={24} />
          <span>Calendar</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => {
            setSelectedDate(getTodayDateString());
            setActiveTab('track');
          }}
          title="Track"
        >
          <div className="track-icon">+</div>
          <span>Track</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
          title="Info"
        >
          <BookOpen size={24} />
          <span>Info</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          title="Settings"
        >
          <SettingsIcon size={24} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
