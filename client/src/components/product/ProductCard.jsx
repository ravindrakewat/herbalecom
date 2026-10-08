import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import LazyImage from '../common/LazyImage';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { siteConfig } from '../../config/siteConfig';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const sellingPrice = product.sellingPrice || product.price || 0;
  const mrp = product.mrp || product.originalPrice || sellingPrice;
  const isDiscounted = mrp > sellingPrice;
  const discountPercent = isDiscounted ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const isLiked = isInWishlist(product._id);
  const imageUrl = product.thumbnail || product.images?.[0]?.url || product.image || '';

  const getStockBadge = () => {
    switch (product.stockStatus) {
      case 'OUT_OF_STOCK':
        return <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>Out of Stock</span>;
      case 'LOW_STOCK':
        return <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>Only a few left</span>;
      default:
        return <span style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>In Stock</span>;
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Top Image Box */}
      <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f4f6f4' }}>
        <Link to={`/product/${product.slug}`}>
          <LazyImage src={imageUrl} alt={product.name} width={400} height={300} />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label="Add to wishlist"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease',
          }}
        >
          <Heart size={18} color={isLiked ? '#e63946' : '#5c6e63'} fill={isLiked ? '#e63946' : 'none'} />
        </button>

        {/* Discount Badge */}
        {isDiscounted && discountPercent > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#e63946',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '99px',
            }}
          >
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Category & Stock Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#5c6e63', fontWeight: 500 }}>
              {product.category?.name || 'Ayurvedic'}
            </span>
            {getStockBadge()}
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
            <h3
              style={{
                fontSize: '1rem',
                color: '#1b4332',
                fontWeight: 600,
                marginBottom: '0.4rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.35,
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Rating Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ffb703' }}>
              <Star size={14} fill="#ffb703" color="#ffb703" />
              <span style={{ fontWeight: 600, color: '#1b4332', marginLeft: '0.2rem' }}>
                {product.averageRating || product.rating || 5.0}
              </span>
            </div>
            <span style={{ color: '#8e9e94' }}>({product.reviewCount || product.numReviews || 0})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1b4332' }}>
              {siteConfig.currency}{sellingPrice.toLocaleString('en-IN')}
            </span>
            {isDiscounted && (
              <span style={{ fontSize: '0.85rem', color: '#8e9e94', textDecoration: 'line-through' }}>
                {siteConfig.currency}{mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stockStatus === 'OUT_OF_STOCK'}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.55rem',
              fontSize: '0.85rem',
              opacity: product.stockStatus === 'OUT_OF_STOCK' ? 0.6 : 1,
              cursor: product.stockStatus === 'OUT_OF_STOCK' ? 'not-allowed' : 'pointer',
            }}
          >
            <ShoppingBag size={16} />
            {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
