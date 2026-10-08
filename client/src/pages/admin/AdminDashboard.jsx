import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminChart from '../../components/admin/AdminChart';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { siteConfig } from '../../config/siteConfig';
import {
  ShoppingBag,
  Clock,
  Users,
  Package,
  AlertTriangle,
  IndianRupee,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [mRes, tRes] = await Promise.all([
          adminService.getDashboardMetrics(),
          adminService.getRevenueTrend(period),
        ]);
        setMetrics(mRes.data);
        setTrendData(tRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [period]);

  if (loading) {
    return <div style={{ padding: '2rem', color: '#5c6e63' }}>Loading Admin Dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>Business Dashboard</h1>
          <p style={{ color: '#5c6e63', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Real-time platform metrics and store analytics
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <AdminStatCard
          title="Total Revenue"
          value={`${siteConfig.currency}${(metrics?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={IndianRupee}
          color="#1b4332"
          bg="#d8f3dc"
        />
        <AdminStatCard
          title="Total Orders"
          value={metrics?.totalOrders || 0}
          icon={ShoppingBag}
          color="#2b6cb0"
          bg="#ebf8ff"
        />
        <AdminStatCard
          title="Pending Orders"
          value={metrics?.pendingOrders || 0}
          icon={Clock}
          color="#d69e2e"
          bg="#fefcbf"
        />
        <AdminStatCard
          title="Total Customers"
          value={metrics?.totalCustomers || 0}
          icon={Users}
          color="#805ad5"
          bg="#faf5ff"
        />
        <AdminStatCard
          title="Active Products"
          value={metrics?.totalProducts || 0}
          icon={Package}
          color="#319795"
          bg="#e6fffa"
        />
        <AdminStatCard
          title="Low Stock Items"
          value={metrics?.lowStockProducts || 0}
          icon={AlertTriangle}
          color="#e53e3e"
          bg="#fff5f5"
          subtitle="Stock <= 5 units"
        />
      </div>

      {/* Revenue Trend Chart Widget */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#1b4332', fontSize: '1.1rem' }}>Sales & Revenue Analytics</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['7d', '30d', '90d', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #c8d6ce',
                  backgroundColor: period === p ? '#1b4332' : '#ffffff',
                  color: period === p ? '#ffffff' : '#5c6e63',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <AdminChart data={trendData} height={220} title="" />
      </div>

      {/* Recent Orders & Low Stock Tables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
        {/* Recent Orders */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#1b4332', fontSize: '1.1rem' }}>Latest Orders</h3>
            <Link to="/admin/orders" style={{ color: '#1b4332', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {!metrics?.recentOrders || metrics.recentOrders.length === 0 ? (
            <p style={{ color: '#5c6e63', fontSize: '0.9rem' }}>No recent orders.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8e4', textAlign: 'left', color: '#5c6e63' }}>
                    <th style={{ padding: '0.6rem' }}>Order No</th>
                    <th style={{ padding: '0.6rem' }}>Customer</th>
                    <th style={{ padding: '0.6rem' }}>Amount</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentOrders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid #f0f4f2' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: '#1b4332' }}>
                        <Link to={`/admin/orders/${ord.orderNumber}`} style={{ color: '#1b4332', textDecoration: 'none' }}>
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td style={{ padding: '0.6rem' }}>
                        {ord.shippingAddress?.fullName || 'Customer'}
                      </td>
                      <td style={{ padding: '0.6rem', fontWeight: 700 }}>
                        {siteConfig.currency}{(ord.grandTotal || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.6rem' }}>
                        <AdminStatusBadge status={ord.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Widget */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#1b4332', fontSize: '1.1rem' }}>Low Stock Alert</h3>
            <Link to="/admin/inventory" style={{ color: '#1b4332', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Manage
            </Link>
          </div>

          {!metrics?.lowStockAlerts || metrics.lowStockAlerts.length === 0 ? (
            <p style={{ color: '#52b788', fontSize: '0.9rem' }}>All product inventory levels are healthy.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.lowStockAlerts.map((prod) => (
                <div key={prod._id} style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#9b1c1c', display: 'block' }}>{prod.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#742a2a' }}>SKU: {prod.sku || 'N/A'}</span>
                  </div>
                  <span style={{ backgroundColor: '#e53e3e', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {prod.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
