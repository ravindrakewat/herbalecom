import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import categoryService from '../../services/categoryService';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    category: '',
    shortDescription: '',
    description: '',
    mrp: 0,
    sellingPrice: 0,
    costPrice: 0,
    stockQuantity: 10,
    lowStockThreshold: 5,
    trackInventory: true,
    thumbnail: '',
    imageUrls: '',
    ingredients: '',
    benefits: '',
    howToUse: '',
    disclaimer: 'Consult an Ayurvedic physician before use.',
    seoTitle: '',
    seoDescription: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNameBlur = () => {
    if (!form.slug && form.name) {
      setForm((prev) => ({
        ...prev,
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(form.sellingPrice) > Number(form.mrp)) {
      setErrorMsg('Selling Price cannot exceed MRP.');
      return;
    }

    try {
      setLoading(true);
      const imagesPayload = form.imageUrls
        ? form.imageUrls.split('\n').filter(Boolean).map((url) => ({ url: url.trim() }))
        : [];

      const payload = {
        name: form.name,
        slug: form.slug,
        sku: form.sku,
        category: form.category,
        shortDescription: form.shortDescription,
        description: form.description,
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        costPrice: Number(form.costPrice),
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        trackInventory: form.trackInventory,
        thumbnail: form.thumbnail || (imagesPayload[0]?.url || ''),
        images: imagesPayload,
        ingredients: form.ingredients ? form.ingredients.split(',').map((s) => s.trim()) : [],
        benefits: form.benefits ? form.benefits.split(',').map((s) => s.trim()) : [],
        howToUse: form.howToUse,
        disclaimer: form.disclaimer,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      };

      await productService.createProduct(payload);
      navigate('/admin/products');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin/products" style={{ color: '#5c6e63', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Products
        </Link>
        <h1 style={{ fontSize: '1.8rem', color: '#1b4332', margin: 0 }}>Add New Herbal Product</h1>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#fde8e8', color: '#9b1c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Basic Information */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>1. Basic Specification</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Product Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} onBlur={handleNameBlur} placeholder="e.g. Pure Triphala Churna" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Slug (URL identifier) *</label>
              <input type="text" name="slug" required value={form.slug} onChange={handleChange} placeholder="e.g. pure-triphala-churna" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>SKU Code *</label>
              <input type="text" name="sku" required value={form.sku} onChange={handleChange} placeholder="e.g. HERB-TRIP-001" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Category *</label>
              <select name="category" required value={form.category} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce', backgroundColor: '#fff' }}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Short Description</label>
            <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief 1-liner summary for product cards" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Full Description *</label>
            <textarea name="description" required rows={4} value={form.description} onChange={handleChange} placeholder="Detailed product description..." style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>2. Pricing & Inventory Control</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>MRP (₹) *</label>
              <input type="number" name="mrp" required min="0" value={form.mrp} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Selling Price (₹) *</label>
              <input type="number" name="sellingPrice" required min="0" value={form.sellingPrice} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Cost Price (₹ - Admin Private)</label>
              <input type="number" name="costPrice" min="0" value={form.costPrice} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Stock Quantity *</label>
              <input type="number" name="stockQuantity" required min="0" value={form.stockQuantity} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Low Stock Alert Threshold</label>
              <input type="number" name="lowStockThreshold" min="0" value={form.lowStockThreshold} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
            </div>
          </div>
        </div>

        {/* Section 3: Image Management */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>3. Images</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Thumbnail Image URL</label>
            <input type="text" name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Gallery Image URLs (1 per line)</label>
            <textarea name="imageUrls" rows={3} value={form.imageUrls} onChange={handleChange} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        {/* Section 4: Herbal Specification */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8e4' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#1b4332', fontSize: '1.1rem' }}>4. Herbal Information</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Ingredients (comma separated)</label>
            <input type="text" name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Amla, Haritaki, Bibhitaki" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Key Benefits (comma separated)</label>
            <input type="text" name="benefits" value={form.benefits} onChange={handleChange} placeholder="Supports Digestion, Detoxification" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>How to Use</label>
            <input type="text" name="howToUse" value={form.howToUse} onChange={handleChange} placeholder="Take 1 tsp with warm water before bedtime." style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #c8d6ce' }} />
          </div>
        </div>

        {/* Section 5: Status Controls */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8e4', display: 'flex', gap: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#1b4332' }}>
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: '#1b4332' }} />
            Active (Visible on Customer Store)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, color: '#1b4332' }}>
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ accentColor: '#1b4332' }} />
            Featured Product
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ backgroundColor: '#1b4332', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Save size={18} /> {loading ? 'Saving Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductCreate;
