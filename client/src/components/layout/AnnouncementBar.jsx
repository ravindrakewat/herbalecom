import React from 'react';
import { Leaf, Truck } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div
      style={{
        backgroundColor: '#142e20',
        color: '#e4eee8',
        padding: '0.42rem 1.5rem',
        fontSize: '0.78rem',
        fontWeight: 500,
        letterSpacing: '0.2px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container-fluid"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#b8dec9' }}>
          <Leaf size={14} color="#74c69d" />
          <span>Pure &bull; Plant-Based &bull; Thoughtfully Made</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e4eee8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={14} color="#74c69d" />
            <span>Free Shipping across India on orders above ₹499</span>
          </div>
          <span className="desktop-only" style={{ opacity: 0.35 }}>|</span>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b8dec9' }}>
            <Leaf size={13} color="#74c69d" />
            <span>100% Natural Ingredients</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
