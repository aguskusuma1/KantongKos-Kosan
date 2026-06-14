import React, { useState, useEffect } from 'react';
import BudgetSetup from './components/BudgetSetup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { useBudget } from './hooks/useBudget';
import LandingPage from './components/LandingPage';
import { LogOut } from 'lucide-react';

function MainApp({ userId }) {
  const { 
    loading, 
    budget, 
    todayBudget, 
    todaySpent, 
    saveBudget, 
    addExpense 
  } = useBudget(userId);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }}></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('ab_user_id');
    window.location.reload();
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Top right logout button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
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
      </div>

      <div style={{ padding: '20px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!budget ? (
          <BudgetSetup onSave={saveBudget} />
        ) : (
          <Dashboard 
            budgetLimit={todayBudget} 
            todaySpent={todaySpent} 
            onAddExpense={addExpense}
            totalBudget={budget.total_budget}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Cek auth di localStorage
    const savedUserId = localStorage.getItem('ab_user_id');
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  return (
    <div style={{ width: '100%' }}>
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
