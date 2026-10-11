import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Ticket,
  MessageSquare,
  Image,
  BarChart2,
  Settings,
  X,
  ExternalLink,
  Truck,
  FileText,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: Layers, path: '/admin/categories' },
  { label: 'Inventory', icon: Boxes, path: '/admin/inventory' },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Shipments', icon: Truck, path: '/admin/shipments' },
  { label: 'Invoices', icon: FileText, path: '/admin/invoices' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
  { label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Reports', icon: BarChart2, path: '/admin/reports' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#1b4332',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.2s ease',
          boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#52b788', letterSpacing: '0.5px' }}>
              HERBAL
            </span>
            <span style={{ fontSize: '0.8rem', color: '#b7e4c7', display: 'block', fontWeight: 600 }}>
              Management Panel
            </span>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin' || item.path === '/admin/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: isActive ? '#ffffff' : '#b7e4c7',
                    backgroundColor: isActive ? '#2d6a4f' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Storefront Link */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#d8f3dc',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={16} /> View Live Store
          </a>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
