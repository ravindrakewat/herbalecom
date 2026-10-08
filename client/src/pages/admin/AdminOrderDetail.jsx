import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import { siteConfig } from '../../config/siteConfig';
import { ArrowLeft, Save, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

const AdminOrderDetail = () => {
  const { orderNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminOrderDetail(orderNumber);
      setData(res.data);
      if (res.data?.order) {
        setNewOrderStatus(res.data.order.orderStatus);
        setNewPaymentStatus(res.data.order.paymentStatus);
      }
    } catch (err) {
      console.error('Failed to fetch order detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orderNumber]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setSuccessMsg('');
      await adminService.updateAdminOrderStatus(orderNumber, {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
      });
      setSuccessMsg('Order status updated successfully!');
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#5c6e63' }}>Loading order specification...</div>;
  }

  const { order, payment } = data || {};
  if (!order) {
    return <div style={{ padding: '2rem', color: '#5c6e63' }}>Order not found.</div>;
  }

  return (
    <div style={{ maxWidth: '950px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin/orders" style={{ color: '#5c6e63', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Orders
        </Link>
        <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>
          Order Specification #{order.orderNumber}
        </h1>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} /> <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Left Column: Items & Customer Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Purchased Items Snapshot */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>Purchased Items Snapshot</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f4f2', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8e4' }} />
                      )}
                      <div>
                        <strong style={{ color: '#1b4332', fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#8e9e94' }}>
                          Price: {siteConfig.currency}{item.sellingPrice} × {item.quantity} units
                        </span>
                      </div>
                    </div>
                    <strong style={{ color: '#1b4332', fontSize: '0.95rem' }}>
                      {siteConfig.currency}{(item.subtotal || 0).toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))}
            </div>

            {/* Financial Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#5c6e63', borderTop: '2px solid #e2e8e4', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{siteConfig.currency}{(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Charge:</span>
                <span>{siteConfig.currency}{order.shippingCharge || 0}</span>
              </div>
              {order.tax > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax:</span>
                  <span>{siteConfig.currency}{order.tax}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#1b4332', marginTop: '0.5rem', borderTop: '1px solid #e2e8e4', paddingTop: '0.5rem' }}>
                <span>Grand Total:</span>
                <span>{siteConfig.currency}{(order.grandTotal || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Address Information */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#52b788" /> Shipping Address & Customer
            </h3>

            <p style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <strong>Recipient:</strong> {order.shippingAddress?.fullName}<br />
              <strong>Phone:</strong> {order.shippingAddress?.phone}<br />
              <strong>Address:</strong> {order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? ', ' : ''}<br />
              <strong>City/State:</strong> {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Right Column: Status Controls & Payment Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Update Form */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>Fulfillment Status Control</h3>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Order Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce', backgroundColor: '#fff', fontSize: '0.9rem' }}
                >
                  <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Payment Status</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce', backgroundColor: '#fff', fontSize: '0.9rem' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={updating}
                style={{ backgroundColor: '#1b4332', color: '#fff', padding: '0.75rem', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                <Save size={18} /> {updating ? 'Updating...' : 'Save Order Status'}
              </button>
            </form>
          </div>

          {/* Payment & Transaction Info */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8e4' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="#52b788" /> Payment Information
            </h3>

            <div style={{ fontSize: '0.85rem', color: '#5c6e63', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <span>Payment Method: </span>
                <strong style={{ color: '#1b4332' }}>{order.paymentMethod}</strong>
              </div>
              <div>
                <span>Payment Status: </span>
                <AdminStatusBadge status={order.paymentStatus} />
              </div>
              {order.razorpayOrderId && (
                <div>
                  <span>Provider Order ID: </span>
                  <strong style={{ color: '#1b4332', wordBreak: 'break-all', display: 'block', fontSize: '0.8rem' }}>{order.razorpayOrderId}</strong>
                </div>
              )}
              {payment && (
                <div>
                  <span>Provider Payment ID: </span>
                  <strong style={{ color: '#1b4332', wordBreak: 'break-all', display: 'block', fontSize: '0.8rem' }}>{payment.providerPaymentId || 'N/A'}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
