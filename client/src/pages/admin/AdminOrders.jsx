import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { siteConfig } from '../../config/siteConfig';
import { Search, Eye } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (p = 1, s = search, os = orderStatus, ps = paymentStatus) => {
    try {
      setLoading(true);
      const res = await adminService.getAdminOrders({
        page: p,
        limit: 15,
        search: s,
        orderStatus: os,
        paymentStatus: ps,
      });
      setOrders(res.data || []);
      if (res.pagination) {
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.pages);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, search, orderStatus, paymentStatus);
  }, [page, orderStatus, paymentStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1, search, orderStatus, paymentStatus);
  };

  const columns = [
    {
      header: 'Order No',
      render: (row) => (
        <strong style={{ color: '#1b4332' }}>
          <Link to={`/admin/orders/${row.orderNumber}`} style={{ color: '#1b4332', textDecoration: 'none' }}>
            {row.orderNumber}
          </Link>
        </strong>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <div>
          <strong style={{ color: '#1b4332', fontSize: '0.85rem', display: 'block' }}>
            {row.shippingAddress?.fullName || 'N/A'}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#8e9e94' }}>{row.shippingAddress?.phone || ''}</span>
        </div>
      ),
    },
    {
      header: 'Items Count',
      render: (row) => `${row.items?.length || 0} items`,
    },
    {
      header: 'Grand Total',
      render: (row) => (
        <span style={{ fontWeight: 800, color: '#1b4332' }}>
          {siteConfig.currency}{(row.grandTotal || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Payment Method / Status',
      render: (row) => (
        <div>
          <span style={{ fontSize: '0.8rem', color: '#5c6e63', display: 'block' }}>{row.paymentMethod}</span>
          <AdminStatusBadge status={row.paymentStatus} />
        </div>
      ),
    },
    {
      header: 'Order Status',
      render: (row) => <AdminStatusBadge status={row.orderStatus} />,
    },
    {
      header: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      header: 'Action',
      render: (row) => (
        <Link
          to={`/admin/orders/${row.orderNumber}`}
          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #1b4332', color: '#1b4332', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <Eye size={14} /> Manage
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>Order Management Panel</h1>
        <p style={{ color: '#5c6e63', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          View, process, and update customer order fulfillment statuses
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8e4', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search order no, customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#1b4332', color: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Search size={16} /> Search
          </button>
        </form>

        <select
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem', backgroundColor: '#fff' }}
        >
          <option value="">All Order Statuses</option>
          <option value="PAYMENT_PENDING">Payment Pending</option>
          <option value="PLACED">Placed (COD)</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem', backgroundColor: '#fff' }}
        >
          <option value="">All Payment Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <AdminTable columns={columns} data={orders} loading={loading} />
      <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default AdminOrders;
