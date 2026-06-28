import React, { useMemo } from 'react';
import { Brain, TrendingUp, Pizza, Coffee, Leaf, Info, Utensils } from 'lucide-react';

export default function WeeklyReport({ expenses }) {
  const reportData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today

    // Filter expenses to last 7 days
    const last7DaysExpenses = (expenses || []).filter(e => {
      const expDate = new Date(e.expense_date);
      expDate.setHours(0, 0, 0, 0);
      return expDate >= sevenDaysAgo && expDate <= today;
    });

    if (last7DaysExpenses.length === 0) {
      return null; // No data for the last 7 days
    }

    // 1. Spending Habits Analysis
    let totalSpent = 0;
    let maxExpense = { amount: 0, description: '' };
    const dailyTotals = {};

    last7DaysExpenses.forEach(e => {
      const amount = Number(e.amount);
      totalSpent += amount;
      
      if (amount > maxExpense.amount) {
        maxExpense = { amount, description: e.description };
      }

      if (!dailyTotals[e.expense_date]) dailyTotals[e.expense_date] = 0;
      dailyTotals[e.expense_date] += amount;
    });

    let maxDayStr = '';
    let maxDayAmount = 0;
    for (const [date, amount] of Object.entries(dailyTotals)) {
      if (amount > maxDayAmount) {
        maxDayAmount = amount;
        maxDayStr = date;
      }
    }

    // Formatter for max day
    const maxDayDateObj = new Date(maxDayStr);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const maxDayName = dayNames[maxDayDateObj.getDay()];

    // 2. Food Pattern Analysis (Keyword Matching)
    const keywords = {
      fastFood: ['gacoan', 'mcd', 'kfc', 'burger', 'pizza', 'mie', 'cepat saji', 'junk'],
      healthy: ['sayur', 'buah', 'gado', 'pecel', 'salad', 'jus', 'vegan'],
      drinks: ['kopi', 'es', 'boba', 'mixue', 'camilan', 'roti', 'kue', 'teh', 'bakar'],
      heavy: ['nasi', 'warung', 'padang', 'sate', 'babi', 'ayam', 'bakso', 'soto']
    };

    const counters = { fastFood: 0, healthy: 0, drinks: 0, heavy: 0, other: 0 };

    last7DaysExpenses.forEach(e => {
      const desc = (e.description || '').toLowerCase();
      let matched = false;

      if (keywords.fastFood.some(k => desc.includes(k))) { counters.fastFood++; matched = true; }
      if (keywords.healthy.some(k => desc.includes(k))) { counters.healthy++; matched = true; }
      if (keywords.drinks.some(k => desc.includes(k))) { counters.drinks++; matched = true; }
      if (keywords.heavy.some(k => desc.includes(k)) && !matched) { counters.heavy++; matched = true; } 
      
      if (!matched) counters.other++;
    });

    let insightMsg = "Belum banyak pola spesifik yang terdeteksi minggu ini. Jangan lupa catat dengan detail!";
    let insightIcon = <Brain size={18} color="var(--primary)" />;

    if (counters.fastFood > counters.healthy && counters.fastFood > 2) {
      insightMsg = "Ups! Kamu cukup sering jajan cepat saji minggu ini. Coba cek kategori 'Menu Sehat' kita sesekali!";
      insightIcon = <Pizza size={18} color="var(--danger)" />;
    } else if (counters.healthy > 0 && counters.healthy >= counters.fastFood) {
      insightMsg = "Keren! Pola makanmu minggu ini cukup sehat. Pertahankan terus ya!";
      insightIcon = <Leaf size={18} color="var(--success)" />;
    } else if (counters.drinks > 2) {
      insightMsg = "Pengeluaran kopi atau camilanmu lumayan tinggi. Perhatikan juga uang jajanmu!";
      insightIcon = <Coffee size={18} color="var(--warning)" />;
    } else if (counters.heavy > 2) {
      insightMsg = "Kamu rajin makan makanan berat minggu ini. Pastikan porsinya pas untuk dompet dan perut!";
      insightIcon = <Utensils size={18} color="var(--primary)" />;
    }

    return {
      totalSpent,
      maxExpense,
      maxDayName,
      insightMsg,
      insightIcon,
      counters
    };
  }, [expenses]);

  if (!reportData) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '12px' }}>
        <Brain size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '600' }}>AI Insight: Laporan 7 Hari</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Kebiasaan Pengeluaran */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ background: 'var(--panel-track-bg)', padding: '8px', borderRadius: '50%' }}>
            <TrendingUp size={18} color="var(--warning)" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Kebiasaan Pengeluaran</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Kamu telah menghabiskan <strong>Rp {reportData.totalSpent.toLocaleString('id-ID')}</strong> minggu ini.
              {reportData.maxExpense.amount > 0 && (
                <span> Pengeluaran terbesarmu adalah <strong>"{reportData.maxExpense.description}"</strong> (Rp {reportData.maxExpense.amount.toLocaleString('id-ID')}). </span>
              )}
              Hari paling boros terjadi pada hari <strong>{reportData.maxDayName}</strong>.
            </p>
          </div>
        </div>

        {/* Pola Konsumsi */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ background: 'var(--panel-track-bg)', padding: '8px', borderRadius: '50%' }}>
            {reportData.insightIcon}
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Pola Konsumsi Makanan</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {reportData.insightMsg}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
