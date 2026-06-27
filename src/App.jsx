import React, { useState, useEffect } from 'react';
import BudgetSetup from './components/BudgetSetup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { useBudget } from './hooks/useBudget';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { LogOut, Sun, Moon, Settings } from 'lucide-react';

function MainApp({ userId, theme, toggleTheme, handleLogout }) {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const { 
    loading, 
    budget, 
    todayBudget, 
    todaySpent, 
    saveBudget, 
    addExpense,
    expenses
  } = useBudget(userId);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }}></div>
      </div>
    );
  }

  const handleSaveBudget = (amount) => {
    saveBudget(amount);
    setIsEditingBudget(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 40 }}>
        <button 
          onClick={() => setShowSettings(true)}
          style={{ 
            background: 'var(--panel-track-bg)', color: 'var(--text-primary)', 
            border: '1px solid var(--surface-border)', padding: '8px', borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Pengaturan"
        >
          <Settings size={18} />
        </button>
      </div>

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          onChangeBudget={() => setIsEditingBudget(true)}
        />
      )}

      <div style={{ padding: '20px 0', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        {(!budget || isEditingBudget) ? (
          <BudgetSetup onSave={handleSaveBudget} />
        ) : (
          <Dashboard 
            budgetLimit={todayBudget} 
            todaySpent={todaySpent} 
            onAddExpense={addExpense}
            totalBudget={budget.total_budget}
            expenses={expenses}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('ab_user_id'));
  const [showAuth, setShowAuth] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('ab_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ab_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('ab_user_id');
    window.location.reload();
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {!userId && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 50 }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'var(--panel-track-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', padding: '8px', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Ubah Tema"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      )}

      {!userId ? (
        !showAuth ? (
          <LandingPage onStart={() => setShowAuth(true)} />
        ) : (
          <Auth onLoginSuccess={(user) => setUserId(user.id)} />
        )
      ) : (
        <MainApp userId={userId} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
