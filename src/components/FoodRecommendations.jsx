import React, { useState } from 'react';
import { Utensils, MapPin, Tag, Flame, Coffee, Pizza, ShoppingBag, Star, Leaf, X, ExternalLink } from 'lucide-react';

export default function FoodRecommendations() {
  const [activeCategory, setActiveCategory] = useState('Terdekat');
  const [selectedFood, setSelectedFood] = useState(null);

  // Gojek-style categories with icons
  const categories = [
    { id: 'Terdekat', name: 'Terdekat', icon: <MapPin size={24} />, color: '#3b82f6' }, // blue
    { id: 'Terlaris', name: 'Terlaris', icon: <Flame size={24} />, color: '#ef4444' }, // red
    { id: 'Aneka Nasi', name: 'Aneka Nasi', icon: <Utensils size={24} />, color: '#f59e0b' }, // yellow
    { id: 'Camilan', name: 'Camilan', icon: <ShoppingBag size={24} />, color: '#8b5cf6' }, // purple
    { id: 'Minuman', name: 'Minuman', icon: <Coffee size={24} />, color: '#06b6d4' }, // cyan
    { id: 'Sehat', name: 'Menu Sehat', icon: <Leaf size={24} />, color: '#22c55e' }, // green
    { id: 'Cepat Saji', name: 'Cepat Saji', icon: <Pizza size={24} />, color: '#f97316' }, // orange
  ];

  const recommendations = [
    {
      id: 1,
      name: 'Warung Makan Budi (Ayam Guling)',
      price: 'Rp 15.000',
      location: 'Jl. Surapati',
      rating: '4.8',
      category: ['Terdekat', 'Aneka Nasi', 'Terlaris'],
      color: 'var(--success)',
      mapQuery: 'Warung Makan Budi Singaraja'
    },
    {
      id: 2,
      name: 'Nasi Jongor Pak Terang',
      price: 'Rp 10.000',
      location: 'Area Kampus Bawah',
      rating: '4.9',
      category: ['Terlaris', 'Aneka Nasi', 'Cepat Saji'],
      color: 'var(--primary)',
      mapQuery: 'Nasi Jongor Singaraja'
    },
    {
      id: 3,
      name: 'Danke Cafe',
      price: 'Rp 18.000',
      location: 'Jl. Udayana',
      rating: '4.7',
      category: ['Minuman', 'Terdekat'],
      color: 'var(--warning)',
      mapQuery: 'Danke Cafe Singaraja'
    },
    {
      id: 4,
      name: 'Gelato Corner',
      price: 'Rp 15.000',
      location: 'Jl. Udayana No.11A',
      rating: '4.6',
      category: ['Camilan', 'Terdekat'],
      color: 'var(--primary)',
      mapQuery: 'Gelato Corner Singaraja'
    },
    {
      id: 5,
      name: 'Kedai Radja Ketjil',
      price: 'Rp 20.000',
      location: 'Jl. Lely No. 10',
      rating: '4.8',
      category: ['Camilan', 'Minuman', 'Terlaris'],
      color: 'var(--success)',
      mapQuery: 'Kedai Radja Ketjil Singaraja'
    },
    {
      id: 6,
      name: 'Kedai 82',
      price: 'Rp 16.000',
      location: 'Jl. Gajah Mada No. 1',
      rating: '4.5',
      category: ['Cepat Saji', 'Aneka Nasi'],
      color: 'var(--danger)',
      mapQuery: 'Kedai 82 Singaraja'
    },
    {
      id: 7,
      name: 'Warung Made Anggrek',
      price: 'Rp 20.000',
      location: 'Jl. Anggrek No. 36',
      rating: '4.9',
      category: ['Aneka Nasi', 'Terlaris'],
      color: 'var(--danger)',
      mapQuery: 'Warung Made Anggrek Singaraja'
    },
    {
      id: 8,
      name: 'Ayam Geprek Nelongso',
      price: 'Rp 15.000',
      location: 'Dekat Undiksha',
      rating: '4.8',
      category: ['Aneka Nasi', 'Cepat Saji', 'Terdekat'],
      color: 'var(--warning)',
      mapQuery: 'Ayam Geprek Nelongso Singaraja'
    },
    {
      id: 9,
      name: 'Salad Sayur Fresh',
      price: 'Rp 20.000',
      location: 'Jl. Ahmad Yani',
      rating: '4.8',
      category: ['Sehat'],
      color: 'var(--success)',
      mapQuery: 'Salad Sayur Singaraja'
    },
    {
      id: 10,
      name: 'Gado-Gado Bu Ning',
      price: 'Rp 12.000',
      location: 'Kaliuntu',
      rating: '4.7',
      category: ['Sehat', 'Terdekat'],
      color: 'var(--success)',
      mapQuery: 'Gado Gado Kaliuntu Singaraja'
    }
  ];

  const filteredRecommendations = recommendations.filter(item => item.category.includes(activeCategory));

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Utensils size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Rekomendasi Menu</h2>
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
          <div 
            key={item.id} 
            className="animate-fade-in" 
            onClick={() => setSelectedFood(item)}
            style={{ 
              background: 'var(--panel-bg)',
              padding: '16px', 
              borderRadius: 'var(--radius-sm)',
              borderLeft: `4px solid ${item.color}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            }}
          >
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
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Peta */}
      {selectedFood && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedFood(null)}
        >
          <div 
            style={{
              background: 'var(--panel-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '24px',
              border: '1px solid var(--surface-border)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Body - Map (At the top) */}
            <div style={{ width: '100%', height: '220px', background: 'var(--panel-track-bg)', position: 'relative' }}>
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedFood.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
              <button 
                onClick={() => setSelectedFood(null)}
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px',
                  background: 'var(--panel-bg)', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Info */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '700', lineHeight: '1.3' }}>
                    {selectedFood.name}
                  </h3>
                  <div style={{ 
                    background: 'var(--panel-track-bg)', 
                    color: 'var(--text-primary)', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    fontWeight: '700'
                  }}>
                    {selectedFood.price}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: '600' }}>
                    <Star size={14} fill="#f59e0b" /> {selectedFood.rating}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {selectedFood.location}
                  </span>
                </div>
              </div>
              
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFood.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'var(--primary)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '14px',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  marginTop: '8px',
                  transition: 'background 0.2s ease, transform 0.1s ease',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              >
                <ExternalLink size={18} />
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
