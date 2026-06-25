import React from 'react';
import { Utensils, MapPin, Tag } from 'lucide-react';

export default function FoodRecommendations() {
  const recommendations = [
    {
      id: 1,
      name: 'Nasi Jinggo',
      warung: 'Warung Bu Komang',
      price: 'Rp 5.000',
      location: 'Jl. Udayana (Depan Kampus)',
      category: 'Sarapan / Malam',
      color: 'var(--success)'
    },
    {
      id: 2,
      name: 'Nasi Campur Ayam',
      warung: 'Warung Men Raka',
      price: 'Rp 10.000 - 15.000',
      location: 'Jl. Dewi Sartika, Singaraja',
      category: 'Makan Siang',
      color: 'var(--primary)'
    },
    {
      id: 3,
      name: 'Lalapan Lele / Ayam',
      warung: 'Lalapan Mas Budi',
      price: 'Rp 12.000 - 15.000',
      location: 'Jl. Ahmad Yani',
      category: 'Makan Malam',
      color: 'var(--warning)'
    },
    {
      id: 4,
      name: 'Mie Ayam Pangsit',
      warung: 'Mie Ayam Pak Min',
      price: 'Rp 10.000',
      location: 'Jl. Sudirman',
      category: 'Kapan Saja',
      color: 'var(--danger)'
    }
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Utensils size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Rekomendasi Menu Kos</h2>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Pilihan makanan hemat bersahabat dengan kantong mahasiswa.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recommendations.map((item) => (
          <div key={item.id} style={{ 
            background: 'rgba(15, 23, 42, 0.4)', 
            padding: '16px', 
            borderRadius: 'var(--radius-sm)',
            borderLeft: `4px solid ${item.color}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', fontWeight: '600' }}>{item.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.warung}</span>
              </div>
              <div style={{ 
                background: `${item.color}20`, 
                color: item.color, 
                padding: '4px 8px', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.7rem', 
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {item.category}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <Tag size={14} color="var(--text-secondary)" />
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.price}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <MapPin size={14} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)' }}>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
