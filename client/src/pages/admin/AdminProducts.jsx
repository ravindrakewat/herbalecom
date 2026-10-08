import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import productService from '../../services/productService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';
import { siteConfig } from '../../config/siteConfig';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Deactivate dialog
  const [deactivateId, setDeactivateId] = useState(null);

  const fetchProducts = async (p = 1, s = search, st = status) => {
    try {
      setLoading(true);
      const res = await adminService.getAdminProducts({ page: p, limit: 15, search: s, status: st });
      setProducts(res.data || []);
      if (res.pagination) {
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.pages);
      }
    } catch (err) {
      console.error('Failed to fetch admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, search, status);
  }, [page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search, status);
  };

  const handleDeactivate = async () => {
    if (!deactivateId) return;
    try {
      await productService.deleteProduct(deactivateId);
      setDeactivateId(null);
      fetchProducts(page, search, status);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate product');
    }
  };

  const columns = [
    {
      header: 'Product',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={row.thumbnail || row.images?.[0]?.url || 'https://via.placeholder.com/40'}
            alt={row.name}
            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8e4' }}
          />
          <div>
            <strong style={{ color: '#1b4332', fontSize: '0.9rem', display: 'block' }}>{row.name}</strong>
            <span style={{ fontSize: '0.75rem', color: '#8e9e94' }}>{row.slug}</span>
          </div>
        </div>
      ),
    },
    { header: 'SKU', accessor: 'sku' },
    {
      header: 'Category',
      render: (row) => row.category?.name || 'Uncategorized',
    },
    {
      header: 'Selling Price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#1b4332' }}>
          {siteConfig.currency}{(row.sellingPrice || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Stock',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.stockQuantity <= 5 ? '#e53e3e' : '#1b4332' }}>
          {row.stockQuantity !== undefined ? row.stockQuantity : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <AdminStatusBadge status={row.isActive} />,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to={/product/}
            target="_blank"
            title="Preview on Live Store"
            style={{ padding: '0.35rem', borderRadius: '6px', border: '1px solid #e2e8e4', color: '#5c6e63' }}
          >
            <Eye size={16} />
          </Link>
          <Link
            to={`/admin/products/${row._id}/edit`}
            title="Edit Product"
            style={{ padding: '0.35rem', borderRadius: '6px', border: '1px solid #1b4332', color: '#1b4332' }}
          >
            <Edit size={16} />
          </Link>
          {row.isActive && (
            <button
              onClick={() => setDeactivateId(row._id)}
              title="Deactivate Product"
              style={{ padding: '0.35rem', borderRadius: '6px', border: '1px solid #e63946', color: '#e63946', background: 'none', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>Product Catalog Management</h1>
          <p style={{ color: '#5c6e63', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Manage herbal products, pricing, and inventory specifications
          </p>
        </div>
        <Link to="/admin/products/new" style={{ backgroundColor: '#1b4332', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8e4', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search by name, SKU, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#1b4332', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <Search size={16} /> Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem', backgroundColor: '#fff' }}
        >
          <option value="">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <AdminTable columns={columns} data={products} loading={loading} emptyMessage="No products match your filter criteria." />
      <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={(p) => setPage(p)} />

      <AdminConfirmDialog
        isOpen={!!deactivateId}
        title="Deactivate Product"
        message="Are you sure you want to deactivate this product? It will no longer appear in the customer storefront catalog."
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateId(null)}
        confirmText="Deactivate"
        danger={true}
      />
    </div>
  );
};

export default AdminProducts;
