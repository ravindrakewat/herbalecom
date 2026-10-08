import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, HeartHandshake } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import CategoryCard from '../components/category/CategoryCard';
import { CategoryCardSkeleton } from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import { siteConfig } from '../config/siteConfig';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catRes, prodRes] = await Promise.all([
        categoryService.getPublicCategories(),
        productService.getProducts({ featured: 'true', limit: 8 }),
      ]);
      setCategories(catRes.data || []);
      setFeaturedProducts(prodRes.data || []);
    } catch (err) {
      console.error('Failed to load home data', err);
      setError('Unable to load storefront data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{ backgroundColor: '#121e17', color: '#ffffff', padding: '4rem 0 5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="badge-herbal" style={{ backgroundColor: '#1b4332', color: '#52b788', marginBottom: '1.25rem', border: '1px solid #2d6a4f' }}>
              <Sparkles size={14} color="#74c69d" /> Authenticated Ayurvedic Formulations
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: '#ffffff', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)', lineHeight: 1.15 }}>
              Pure Herbal Wellness For Body &amp; Mind
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#a3b8ab', marginBottom: '2rem', maxWidth: '540px', lineHeight: 1.6 }}>
              {siteConfig.description} Handcrafted in small batches without artificial preservatives.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                Explore Storefront <ArrowRight size={18} />
              </Link>
              <Link to="/category/herbal-teas" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                Herbal Teas
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
              alt="Herbal Wellness Products"
              style={{ width: '100%', maxWidth: '480px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Main Container Content */}
      <div className="container" style={{ padding: '4rem 1.5rem 2rem 1.5rem' }}>
        {error && <ErrorState message={error} onRetry={fetchHomeData} />}

        {/* Featured Categories Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#52b788', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</span>
              <h2 style={{ fontSize: '2rem', color: '#1b4332' }}>Explore Organic Range</h2>
            </div>
            <Link to="/shop" style={{ color: '#2d6a4f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#52b788', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Handpicked</span>
              <h2 style={{ fontSize: '2rem', color: '#1b4332' }}>Featured Herbal Formulations</h2>
            </div>
            <Link to="/shop?featured=true" style={{ color: '#2d6a4f', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
              Shop Featured <ArrowRight size={16} />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </section>

        {/* Why Choose Us Banner */}
        <section className="glass-card" style={{ padding: '3rem 2rem', borderRadius: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8e4' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#1b4332', marginBottom: '0.75rem' }}>Why Choose {siteConfig.brandName}?</h2>
            <p style={{ color: '#5c6e63', fontSize: '0.95rem' }}>We bridge traditional Himalayan herbal wisdom with modern scientific quality testing.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: '#d8f3dc', borderRadius: '50%', color: '#1b4332', marginBottom: '1rem' }}>
                <Leaf size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#1b4332' }}>100% Pure &amp; Organic</h3>
              <p style={{ fontSize: '0.85rem', color: '#5c6e63' }}>Zero synthetic chemicals, fillers, or artificial colors in any of our herbal teas &amp; churnas.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: '#d8f3dc', borderRadius: '50%', color: '#1b4332', marginBottom: '1rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#1b4332' }}>Third-Party Tested</h3>
              <p style={{ fontSize: '0.85rem', color: '#5c6e63' }}>Every batch undergoes rigorous heavy metal &amp; microbial safety testing before packaging.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: '#d8f3dc', borderRadius: '50%', color: '#1b4332', marginBottom: '1rem' }}>
                <HeartHandshake size={32} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#1b4332' }}>Direct Farm Sourcing</h3>
              <p style={{ fontSize: '0.85rem', color: '#5c6e63' }}>Supporting local organic farming cooperatives across Uttarakhand &amp; Himachal Pradesh.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
