import React, { useState, useEffect } from 'react';
import BudgetSetup from './components/BudgetSetup';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { useBudget } from './hooks/useBudget';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { LogOut, Sun, Moon, Settings } from 'lucide-react';
import { speakText, stopSpeaking } from './lib/tts';


function MainApp({ 
  userId, theme, toggleTheme, handleLogout,
  fontSize, setFontSize, voiceNarrator, setVoiceNarrator
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const { 
    loading, 
    budget, 
    todayBudget, 
    todaySpent, 
    saveBudget, 
    addExpense,
    deleteExpense,
    editExpense,
    expenses,
    selectedDate,
    nextMonth,
    prevMonth,
    isCurrentMonth
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
    if (voiceNarrator) {
      speakText(`Berhasil mengatur budget baru sebesar Rp ${amount.toLocaleString('id-ID')}.`);
    }
  };

  const handleAddExpense = async (amount, description, date) => {
    await addExpense(amount, description, date);
    if (voiceNarrator) {
      const descText = description ? `untuk ${description}` : '';
      speakText(`Berhasil menambahkan pengeluaran sebesar Rp ${amount.toLocaleString('id-ID')} ${descText}.`);
    }
  };

  const handleDeleteExpense = async (id) => {
    const expense = expenses.find(e => e.id === id);
    await deleteExpense(id);
    if (voiceNarrator && expense) {
      speakText(`Berhasil menghapus pengeluaran ${expense.description || ''} sebesar Rp ${Number(expense.amount).toLocaleString('id-ID')}.`);
    }
  };

  const handleEditExpense = async (id, amount, description) => {
    await editExpense(id, amount, description);
    if (voiceNarrator) {
      speakText(`Berhasil mengubah pengeluaran menjadi ${description} sebesar Rp ${amount.toLocaleString('id-ID')}.`);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px' }}>
        <button 
          onClick={() => setShowSettings(true)}
          style={{ 
            background: 'var(--panel-track-bg)', color: 'var(--text-primary)', 
            border: '1px solid var(--surface-border)', padding: '8px', borderRadius: '50%',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Pengaturan"
          aria-label="Buka Pengaturan"
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
          fontSize={fontSize}
          setFontSize={setFontSize}
          voiceNarrator={voiceNarrator}
          setVoiceNarrator={setVoiceNarrator}
        />
      )}

      <div style={{ paddingBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {(!budget || isEditingBudget) ? (
          <BudgetSetup onSave={handleSaveBudget} />
        ) : (
          <Dashboard 
            budgetLimit={todayBudget} 
            todaySpent={todaySpent} 
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
            totalBudget={budget.total_budget}
            expenses={expenses}
            budgetMode={budget.mode}
            selectedDate={selectedDate}
            nextMonth={nextMonth}
            prevMonth={prevMonth}
            isCurrentMonth={isCurrentMonth}
            voiceNarrator={voiceNarrator}
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
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('ab_font_size') || 'normal');
  const [voiceNarrator, setVoiceNarrator] = useState(() => localStorage.getItem('ab_voice_narrator') === 'true');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ab_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('ab_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ab_voice_narrator', voiceNarrator ? 'true' : 'false');
    if (!voiceNarrator) {
      stopSpeaking();
    }
  }, [voiceNarrator]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'high-contrast';
      return 'dark';
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('ab_user_id');
    window.location.reload();
  };

  return (
    <div style={{ width: '100%' }}>
      {!userId && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px' }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'var(--panel-track-bg)', color: 'var(--text-primary)', 
              border: '1px solid var(--surface-border)', padding: '8px', borderRadius: '50%',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Ubah Tema"
            aria-label="Ubah Tema"
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
        <MainApp 
          userId={userId} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          handleLogout={handleLogout}
          fontSize={fontSize}
          setFontSize={setFontSize}
          voiceNarrator={voiceNarrator}
          setVoiceNarrator={setVoiceNarrator}
        />
      )}
    </div>
  );
}


export default App;
