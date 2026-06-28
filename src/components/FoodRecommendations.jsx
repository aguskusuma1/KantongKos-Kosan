import React, { useState } from 'react';
import { Utensils, MapPin, Tag, Flame, Coffee, Pizza, ShoppingBag, Star } from 'lucide-react';

export default function FoodRecommendations() {
  const [activeCategory, setActiveCategory] = useState('Terdekat');

  // Gojek-style categories with icons
  const categories = [
    { id: 'Terdekat', name: 'Terdekat', icon: <MapPin size={24} />, color: '#3b82f6' }, // blue
    { id: 'Terlaris', name: 'Terlaris', icon: <Flame size={24} />, color: '#ef4444' }, // red
    { id: 'Promo', name: 'Promo Hemat', icon: <Tag size={24} />, color: '#10b981' }, // green
    { id: 'Aneka Nasi', name: 'Aneka Nasi', icon: <Utensils size={24} />, color: '#f59e0b' }, // yellow
    { id: 'Camilan', name: 'Camilan', icon: <ShoppingBag size={24} />, color: '#8b5cf6' }, // purple
    { id: 'Minuman', name: 'Minuman', icon: <Coffee size={24} />, color: '#06b6d4' }, // cyan
    { id: 'Cepat Saji', name: 'Cepat Saji', icon: <Pizza size={24} />, color: '#f97316' }, // orange
  ];

  const recommendations = [
    {
      id: 1,
      name: 'Nasi Jinggo Bu Komang',
      price: 'Rp 5.000',
      discount: 'Rp 4.000',
      location: '0.2 km',
      rating: '4.8',
      category: ['Terdekat', 'Promo', 'Aneka Nasi'],
      color: 'var(--success)'
    },
    {
      id: 2,
      name: 'Lalapan Ayam Mas Budi',
      price: 'Rp 15.000',
      location: '1.2 km',
      rating: '4.9',
      category: ['Terlaris', 'Aneka Nasi'],
      color: 'var(--primary)'
    },
    {
      id: 3,
      name: 'Es Kopi Susu Senja',
      price: 'Rp 12.000',
      location: '0.5 km',
      rating: '4.7',
      category: ['Minuman', 'Terdekat'],
      color: 'var(--warning)'
    },
    {
      id: 4,
      name: 'Nasi Goreng Gila',
      price: 'Rp 13.000',
      discount: 'Rp 10.000',
      location: '1.5 km',
      rating: '4.6',
      category: ['Promo', 'Terlaris', 'Aneka Nasi'],
      color: 'var(--danger)'
    },
    {
      id: 5,
      name: 'Siomay & Batagor Kang Cepot',
      price: 'Rp 10.000',
      location: '0.8 km',
      rating: '4.8',
      category: ['Camilan', 'Terlaris'],
      color: 'var(--success)'
    },
    {
      id: 6,
      name: 'Burger & Fries Makmur',
      price: 'Rp 25.000',
      location: '2.0 km',
      rating: '4.5',
      category: ['Cepat Saji'],
      color: 'var(--danger)'
    }
  ];

  const filteredRecommendations = recommendations.filter(item => item.category.includes(activeCategory));

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Utensils size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Gofood Kos-kosan</h2>
      </div>

      {/* Kategori Gojek Style (Grid/Scrollable) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px 8px', 
        marginBottom: '24px'
      }}>
        {categories.slice(0, 8).map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              opacity: activeCategory === cat.id ? 1 : 0.6,
              transform: activeCategory === cat.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: `${cat.color}15`,
              color: cat.color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: activeCategory === cat.id ? `2px solid ${cat.color}` : '2px solid transparent'
            }}>
              {cat.icon}
            </div>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: activeCategory === cat.id ? '700' : '500',
              color: 'var(--text-primary)',
              textAlign: 'center',
              lineHeight: '1.1'
            }}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* List Makanan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredRecommendations.map((item) => (
          <div key={item.id} className="animate-fade-in" style={{ 
            background: 'var(--panel-bg)',
            padding: '16px', 
            borderRadius: 'var(--radius-sm)',
            borderLeft: `4px solid ${item.color}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', fontWeight: '700' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: '600' }}>
                    <Star size={12} fill="#f59e0b" /> {item.rating}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <MapPin size={12} /> {item.location}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {item.discount ? (
                <>
                  <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{item.price}</span>
                  <span style={{ fontWeight: '700', color: 'var(--success)' }}>{item.discount}</span>
                  <div style={{ background: 'var(--danger)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Promo</div>
                </>
              ) : (
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.price}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
