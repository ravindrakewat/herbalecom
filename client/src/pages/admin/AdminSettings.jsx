import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Save, CheckCircle, Settings, ShieldAlert } from 'lucide-react';

const AdminSettings = () => {
  const [form, setForm] = useState({
    storeName: 'Herbal E-Commerce',
    supportEmail: 'support@herbal.com',
    supportPhone: '+91 98765 43210',
    currency: '₹',
    freeShippingThreshold: 999,
    defaultShippingCharge: 50,
    taxRate: 0.00,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await adminService.getSettings();
        if (res.data) {
          setForm({
            storeName: res.data.storeName || 'Herbal E-Commerce',
            supportEmail: res.data.supportEmail || 'support@herbal.com',
            supportPhone: res.data.supportPhone || '+91 98765 43210',
            currency: res.data.currency || '₹',
            freeShippingThreshold: res.data.freeShippingThreshold !== undefined ? res.data.freeShippingThreshold : 999,
            defaultShippingCharge: res.data.defaultShippingCharge !== undefined ? res.data.defaultShippingCharge : 50,
            taxRate: res.data.taxRate !== undefined ? res.data.taxRate : 0.00,
          });
        }
      } catch (err) {
        console.error('Failed to fetch store settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      await adminService.updateSettings({
        storeName: form.storeName,
        supportEmail: form.supportEmail,
        supportPhone: form.supportPhone,
        currency: form.currency,
        freeShippingThreshold: Number(form.freeShippingThreshold),
        defaultShippingCharge: Number(form.defaultShippingCharge),
        taxRate: Number(form.taxRate),
      });
      setSuccessMsg('Store configuration settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update store settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: '#5c6e63' }}>Loading store configuration...</div>;
  }

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>Store Configuration & Settings</h1>
        <p style={{ color: '#5c6e63', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
          Configure business thresholds, shipping parameters, and public support channels
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e2e8e4', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, color: '#1b4332', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} color="#52b788" /> Store Identity & Support
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Store Name</label>
            <input type="text" name="storeName" value={form.storeName} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Currency Symbol</label>
            <input type="text" name="currency" value={form.currency} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Support Email</label>
            <input type="email" name="supportEmail" value={form.supportEmail} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Support Phone</label>
            <input type="text" name="supportPhone" value={form.supportPhone} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        <h3 style={{ margin: '1rem 0 0', color: '#1b4332', fontSize: '1.1rem', borderTop: '1px solid #e2e8e4', paddingTop: '1.25rem' }}>
          Fulfillment & Tax Rules
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Free Shipping Threshold (₹)</label>
            <input type="number" min="0" name="freeShippingThreshold" value={form.freeShippingThreshold} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Default Shipping Charge (₹)</label>
            <input type="number" min="0" name="defaultShippingCharge" value={form.defaultShippingCharge} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Tax Rate (e.g. 0.05 for 5%)</label>
          <input type="number" step="0.01" min="0" max="1" name="taxRate" value={form.taxRate} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
        </div>

        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} />
          <span>Payment Gateway Secrets (Razorpay Key Secret & Webhook Secret) remain strictly secured on the server environment.</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{ backgroundColor: '#1b4332', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
        >
          <Save size={18} /> {saving ? 'Saving Settings...' : 'Save Configurations'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
