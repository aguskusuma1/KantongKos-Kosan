import React from 'react';
import { PieChart } from 'lucide-react'; // Using PieChart icon as a generic chart icon

export default function WeeklyChart({ expenses, totalBudget }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Calculate the number of weeks (usually 5)
  // W1: 1-7, W2: 8-14, W3: 15-21, W4: 22-28, W5: 29-end
  const weeks = [];
  
  for (let w = 1; w <= 5; w++) {
    const startDay = (w - 1) * 7 + 1;
    let endDay = w * 7;
    if (w === 5) {
      if (daysInMonth < 29) break; // February might not have week 5
      endDay = daysInMonth;
    }

    let spent = 0;
    
    // Sum expenses for this week
    if (expenses && expenses.length > 0) {
      for (let d = startDay; d <= endDay; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const spentOnThisDay = expenses
          .filter(e => e.expense_date === dateStr)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        spent += spentOnThisDay;
      }
    }
    
    weeks.push({
      week: w,
      label: `Mg ${w}`,
      range: `${startDay}-${endDay}`,
      spent,
      daysInWeek: endDay - startDay + 1
    });
  }

  // Calculate average weekly limit
  // A standard week has 7 days, the last week might have less.
  // Instead of a flat limit, let's use the average daily limit * days in that week.
  const dailyAverageLimit = totalBudget / daysInMonth;
  
  let maxSpent = 0;
  weeks.forEach(w => {
    const weeklyLimit = dailyAverageLimit * w.daysInWeek;
    w.limit = weeklyLimit;
    w.isOver = w.spent > weeklyLimit;
    if (w.spent > maxSpent) maxSpent = w.spent;
    if (weeklyLimit > maxSpent) maxSpent = weeklyLimit;
  });

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PieChart size={20} color="var(--warning)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ringkasan Mingguan</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', justifyContent: 'space-between', height: '180px', paddingTop: '20px', paddingBottom: '12px' }}>
        {weeks.map((data) => {
          // Calculate height percentage
          const heightPercent = maxSpent > 0 ? Math.max((data.spent / maxSpent) * 100, 2) : 2;
          
          let barColor = 'rgba(59, 130, 246, 0.4)'; // Default faint blue
          if (data.spent > 0) {
            barColor = data.isOver ? 'var(--danger)' : 'var(--success)'; // Using success (green) for weekly to differentiate from monthly
          }

          return (
            <div 
              key={data.week} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '8px',
                flex: 1
              }}
              title={`Minggu ${data.week} (${data.range}): Rp ${data.spent.toLocaleString('id-ID')} / Limit: Rp ${Math.round(data.limit).toLocaleString('id-ID')}`}
            >
              {/* The Bar Container */}
              <div style={{ 
                width: '100%', 
                maxWidth: '40px',
                height: '100%', 
                display: 'flex', 
                alignItems: 'flex-end',
                background: 'var(--panel-track-bg)', // background track
                borderRadius: '6px',
                position: 'relative'
              }}>
                {/* Limit Indicator Line */}
                <div style={{
                  position: 'absolute',
                  bottom: `${(data.limit / maxSpent) * 100}%`,
                  left: -5,
                  right: -5,
                  height: '2px',
                  background: 'var(--surface-border)',
                  zIndex: 3
                }} />
                
                {/* Fill */}
                <div style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  background: barColor,
                  borderRadius: '6px',
                  transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 2,
                  boxShadow: data.spent > 0 ? `0 0 12px ${barColor}40` : 'none'
                }} />
              </div>
              
              {/* Labels */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {data.label}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  Tgl {data.range}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--success)' }}></div> Aman
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--danger)' }}></div> Over Budget
        </div>
      </div>
    </div>
  );
}
