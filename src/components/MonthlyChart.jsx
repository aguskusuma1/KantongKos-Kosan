import React, { useRef, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';

export default function MonthlyChart({ expenses, totalBudget }) {
  const scrollRef = useRef(null);
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Calculate average daily limit for comparison
  const dailyAverageLimit = totalBudget / daysInMonth;

  // Prepare data for all days in the month
  const chartData = [];
  let maxSpent = dailyAverageLimit; // Ensure the chart scales to at least the limit

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const spentOnThisDay = (expenses || [])
      .filter(e => e.expense_date === dateStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    if (spentOnThisDay > maxSpent) {
      maxSpent = spentOnThisDay;
    }

    chartData.push({
      day: i,
      dateStr,
      spent: spentOnThisDay,
      isOver: spentOnThisDay > dailyAverageLimit,
      isToday: i === currentDay
    });
  }

  // Auto-scroll to today
  useEffect(() => {
    if (scrollRef.current) {
      // rough calculation to scroll to current day: total width approx 40px per item
      const scrollPosition = (currentDay - 1) * 44 - 100;
      scrollRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    }
  }, [currentDay]);

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <BarChart2 size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Grafik Bulanan</h2>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Rata-rata limit harian: Rp {Math.round(dailyAverageLimit).toLocaleString('id-ID')}
      </div>

      {/* Chart Container */}
      <div 
        ref={scrollRef}
        style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '12px',
          paddingTop: '20px',
          minHeight: '160px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--primary) transparent'
        }}
      >
        {chartData.map((data) => {
          // Calculate height percentage (min 5% to show an empty bar slot)
          const heightPercent = maxSpent > 0 ? Math.max((data.spent / maxSpent) * 100, 2) : 2;
          
          let barColor = 'rgba(59, 130, 246, 0.4)'; // Default faint blue
          if (data.spent > 0) {
            barColor = data.isOver ? 'var(--danger)' : 'var(--primary)';
          }

          return (
            <div 
              key={data.day} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '8px',
                minWidth: '36px'
              }}
              title={`Tanggal ${data.day}: Rp ${data.spent.toLocaleString('id-ID')}`}
            >
              {/* The Bar */}
              <div style={{ 
                width: '100%', 
                height: '100px', 
                display: 'flex', 
                alignItems: 'flex-end',
                background: 'var(--panel-track-bg)', // background track
                borderRadius: '4px',
                position: 'relative'
              }}>
                {/* Limit Indicator Line */}
                <div style={{
                  position: 'absolute',
                  bottom: `${(dailyAverageLimit / maxSpent) * 100}%`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--surface-border)',
                  zIndex: 1
                }} />
                
                {/* Fill */}
                <div style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  background: barColor,
                  borderRadius: '4px',
                  transition: 'height 0.3s ease',
                  zIndex: 2,
                  boxShadow: data.spent > 0 ? `0 0 8px ${barColor}40` : 'none'
                }} />
              </div>
              
              {/* Day Label */}
              <div style={{ 
                fontSize: '0.75rem', 
                color: data.isToday ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: data.isToday ? 'bold' : 'normal',
                background: data.isToday ? 'rgba(59,130,246,0.1)' : 'transparent',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {data.day}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }}></div> Sesuai Limit
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--danger)' }}></div> Over Limit
        </div>
      </div>
    </div>
  );
}
