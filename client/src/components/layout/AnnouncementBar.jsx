import React from 'react';
import { Sparkles } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

const AnnouncementBar = () => {
  return (
    <div
      style={{
        backgroundColor: '#0d1f17',
        color: '#52b788',
        padding: '0.45rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 500,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        letterSpacing: '0.3px',
      }}
    >
      <Sparkles size={14} color="#74c69d" />
      <span>{siteConfig.tagline} &bull; Free Shipping across India on orders above ₹499!</span>
    </div>
  );
};

export default AnnouncementBar;
