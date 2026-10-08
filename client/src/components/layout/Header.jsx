import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, Leaf, ShieldCheck, Bell } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { siteConfig } from '../../config/siteConfig';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  React.useEffect(() => {
    if (isAuthenticated) {
      notificationService.getUnreadCount().then((res) => setUnreadNotifCount(res.data?.unreadCount || 0)).catch(() => {});
    }
  }, [isAuthenticated]);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{ backgroundColor: '#1b4332', color: '#ffffff', sticky: 'top', top: 0, zIndex: 1000, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', gap: '1rem' }}>
        
        {/* Brand Logo & Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="mobile-only"
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.2rem' }}
          >
            <Menu size={26} />
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#74c69d', textDecoration: 'none' }}>
            <Leaf size={28} color="#52b788" />
            <span style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff', letterSpacing: '-0.5px' }}>
              {siteConfig.brandName}
            </span>
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="desktop-only" style={{ flex: 1, maxWidth: '420px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search herbal teas, ashwagandha, skin oils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 2.6rem 0.6rem 1rem',
              borderRadius: '99px',
              border: '1px solid #40916c',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1f2923',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            aria-label="Search"
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#2d6a4f', cursor: 'pointer' }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Navigation & User Actions */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
          <Link to="/" className="desktop-only" style={{ color: '#ffffff' }}>Home</Link>
          <Link to="/shop" className="desktop-only" style={{ color: '#ffffff' }}>Shop</Link>

          {/* Wishlist */}
          <Link to="/wishlist" style={{ color: '#ffffff', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Wishlist">
            <Heart size={22} color="#74c69d" />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  backgroundColor: '#e63946',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          {isAuthenticated && (
            <Link to="/notifications" style={{ color: '#ffffff', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Notifications">
              <Bell size={22} color="#74c69d" />
              {unreadNotifCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-10px', backgroundColor: '#e63946', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadNotifCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" style={{ color: '#ffffff', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Shopping Cart">
            <ShoppingBag size={22} color="#74c69d" />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-10px',
                  backgroundColor: '#52b788',
                  color: '#1b4332',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/profile" style={{ color: '#52b788', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                <User size={20} />
                <span className="desktop-only" style={{ color: '#ffffff' }}>{user?.firstName}</span>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" title="Admin Dashboard" className="desktop-only" style={{ color: '#ffb703', display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck size={20} />
                </Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}>
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Search Form Bar */}
      <div className="mobile-only" style={{ padding: '0 1.5rem 0.75rem 1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search herbal teas, ayurvedic oils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2.4rem 0.5rem 0.85rem',
              borderRadius: '99px',
              border: 'none',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
            }}
          />
          <button
            type="submit"
            aria-label="Search"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#2d6a4f' }}
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
