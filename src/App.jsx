import React, { useState, useEffect } from 'react';
import BudgetSetup from './components/BudgetSetup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { useBudget } from './hooks/useBudget';
import LandingPage from './components/LandingPage';
import { LogOut, Sun, Moon } from 'lucide-react';

function MainApp({ userId }) {
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

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '20px 0', width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
        {!budget ? (
          <BudgetSetup onSave={saveBudget} />
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
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 50 }}>
        {userId && (
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', 
              border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-full)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '0.9rem', fontWeight: '500'
            }}
          >
            <LogOut size={16} /> Keluar
          </button>
        )}
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

      {!userId ? (
        !showAuth ? (
          <LandingPage onStart={() => setShowAuth(true)} />
        ) : (
          <Auth onLoginSuccess={(user) => setUserId(user.id)} />
        )
      ) : (
        <MainApp userId={userId} />
      )}
    </div>
  );
}

export default App;
