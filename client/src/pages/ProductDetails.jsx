import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { siteConfig } from '../config/siteConfig';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  CheckCircle, 
  Minus, 
  Plus,
  MessageSquare,
  User,
  AlertCircle
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const [selectedImage, setSelectedImage] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  
  // Review submission state
  const [eligibility, setEligibility] = useState({ eligible: false });
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews(1);
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkEligibility();
    }
  }, [user, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productService.getProductById(id);
      const prodData = res.data?.data || res.data || res;
      setProduct(prodData);

      const mainImg = prodData.images?.find((img) => img.isPrimary)?.url || prodData.images?.[0]?.url || '/placeholder.jpg';
      setSelectedImage(mainImg);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (page = 1) => {
    try {
      setReviewsLoading(true);
      const res = await reviewService.getProductReviews(id, page, 10);
      const data = res.data?.data || res.data || res;
      
      if (page === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      }
      
      setHasMoreReviews(page < (data.pagination?.totalPages || 1));
      setReviewPage(page);
    } catch (err) {
      console.error('Failed to fetch product reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      const res = await reviewService.checkEligibility(id);
      const data = res.data?.data || res.data;
      setEligibility(data || { eligible: false });
    } catch (err) {
      setEligibility({ eligible: false, message: 'Must purchase product to review' });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 10) {
      setReviewMsg({ type: 'error', text: 'Review comment must be at least 10 characters.' });
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewMsg(null);

      await reviewService.createReview(id, {
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });

      setReviewMsg({ type: 'success', text: 'Thank you! Your review has been submitted for moderation.' });
      setNewComment('');
      setNewTitle('');
      setEligibility({ eligible: false, message: 'You have already reviewed this product.' });
    } catch (err) {
      setReviewMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit review.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: '#5c6e63' }}>Loading organic herbal product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#1b4332' }}>Product Not Found</h2>
        <p style={{ color: '#5c6e63', marginBottom: '1.5rem' }}>{error || 'The requested product is unavailable.'}</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const isLiked = wishlist.some((item) => (item._id || item.id) === product._id);
  const mrp = product.pricing?.mrp || product.mrp || 0;
  const sellingPrice = product.pricing?.sellingPrice || product.sellingPrice || product.price || 0;
  const discountPercent = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  const isDiscounted = discountPercent > 0;

  const getStockBadge = () => {
    if (product.stockStatus === 'OUT_OF_STOCK' || product.inventoryQuantity === 0) {
      return <span style={{ backgroundColor: '#fde8e8', color: '#9b1c1c', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>OUT OF STOCK</span>;
    }
    if (product.stockStatus === 'LOW_STOCK') {
      return <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>LOW STOCK</span>;
    }
    return <span style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700 }}>IN STOCK</span>;
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <Breadcrumbs items={[{ label: 'Shop', link: '/shop' }, { label: product.category?.name || 'Category', link: product.category?.slug ? `/category/${product.category.slug}` : '/shop' }, { label: product.name }]} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1.5rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div className="glass-card" style={{ padding: '1rem', borderRadius: '24px', backgroundColor: '#ffffff', textAlign: 'center', marginBottom: '1rem' }}>
            <img
              src={selectedImage}
              alt={product.name}
              style={{ width: '100%', height: '420px', objectFit: 'contain', borderRadius: '16px' }}
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    border: selectedImage === img.url ? '2px solid #1b4332' : '1px solid #e2e8e4',
                    borderRadius: '12px',
                    padding: '0.2rem',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img.url} alt="" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta & Purchase Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#52b788', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {product.category?.name || 'HERBAL REMEDY'}
              </span>
              {getStockBadge()}
            </div>

            <h1 style={{ fontSize: '2rem', color: '#1b4332', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#ffb703' }}>
                <Star size={18} fill="#ffb703" color="#ffb703" />
                <span style={{ fontWeight: 700, color: '#1b4332', marginLeft: '0.3rem' }}>
                  {product.averageRating ? product.averageRating.toFixed(1) : '5.0'}
                </span>
              </div>
              <a href="#reviews-section" style={{ color: '#8e9e94', textDecoration: 'none' }}>({product.reviewCount || 0} customer reviews)</a>
            </div>
          </div>

          {/* Pricing Box */}
          <div style={{ backgroundColor: '#f4f6f4', padding: '1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1b4332' }}>
              {siteConfig.currency}{sellingPrice.toLocaleString('en-IN')}
            </span>
            {isDiscounted && (
              <>
                <span style={{ fontSize: '1.1rem', color: '#8e9e94', textDecoration: 'line-through' }}>
                  {siteConfig.currency}{mrp.toLocaleString('en-IN')}
                </span>
                <span style={{ backgroundColor: '#e63946', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
                  SAVE {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p style={{ color: '#5c6e63', fontSize: '0.95rem', lineHeight: 1.6 }}>{product.shortDescription}</p>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', margin: '0.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8e4', borderRadius: '99px', padding: '0.3rem' }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ background: 'none', border: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontWeight: 700, padding: '0 0.8rem', fontSize: '1rem' }}>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{ background: 'none', border: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stockStatus === 'OUT_OF_STOCK' || product.inventoryQuantity === 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem 1.5rem', fontSize: '1rem' }}
            >
              <ShoppingBag size={20} /> Add to Shopping Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                border: '1px solid #e2e8e4',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
              }}
            >
              <Heart size={22} color={isLiked ? '#e63946' : '#1b4332'} fill={isLiked ? '#e63946' : 'none'} />
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid #e2e8e4', paddingTop: '1.25rem', fontSize: '0.8rem', color: '#5c6e63', textAlign: 'center' }}>
            <div><ShieldCheck size={20} color="#52b788" style={{ marginBottom: '0.2rem' }} /><br />AYUSH Certified</div>
            <div><Truck size={20} color="#52b788" style={{ marginBottom: '0.2rem' }} /><br />Fast Shipping</div>
            <div><RefreshCw size={20} color="#52b788" style={{ marginBottom: '0.2rem' }} /><br />7-Day Returns</div>
          </div>
        </div>
      </div>

      {/* Herbal Information & Review Tabs */}
      <div className="glass-card" style={{ marginTop: '4rem', padding: '2rem', borderRadius: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8e4', paddingBottom: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {['benefits', 'ingredients', 'howToUse', 'disclaimer', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '99px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#1b4332' : 'transparent',
                color: activeTab === tab ? '#ffffff' : '#5c6e63',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'howToUse' ? 'How To Use' : tab === 'reviews' ? `Reviews (${product.reviewCount || 0})` : tab}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.95rem', color: '#1f2923', lineHeight: 1.7 }}>
          {activeTab === 'benefits' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#1b4332', marginBottom: '0.75rem' }}>Key Health &amp; Wellness Benefits</h3>
              {product.benefits && product.benefits.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {product.benefits.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={18} color="#52b788" /> {b}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#1b4332', marginBottom: '0.75rem' }}>100% Herbal &amp; Ayurvedic Ingredients</h3>
              {product.ingredients && product.ingredients.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {product.ingredients.map((ing, i) => (
                    <li key={i} style={{ marginBottom: '0.4rem' }}>{ing}</li>
                  ))}
                </ul>
              ) : (
                <p>Authentic handpicked Himalayan botanical extracts.</p>
              )}
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#1b4332', marginBottom: '0.75rem' }}>Usage &amp; Dosage Instructions</h3>
              <p>{product.usageInstructions || product.howToUse || 'Take as directed on packaging or consult an Ayurvedic doctor.'}</p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#1b4332', marginBottom: '0.75rem' }}>Safety Disclaimer &amp; Allergen Warning</h3>
              <p style={{ color: '#5c6e63' }}>{product.disclaimer || 'Consult a healthcare practitioner before use if pregnant or taking prescription medication.'}</p>
              {product.allergenInformation && (
                <p style={{ marginTop: '0.5rem', fontWeight: 600, color: '#991b1b' }}>Allergen Info: {product.allergenInformation}</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div id="reviews-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#1b4332', margin: 0 }}>Customer Reviews &amp; Ratings</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <div style={{ display: 'flex', color: '#ffb703' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={18} fill={star <= Math.round(product.averageRating || 5) ? '#ffb703' : 'none'} color="#ffb703" />
                      ))}
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: '#1b4332' }}>{product.averageRating ? product.averageRating.toFixed(1) : '5.0'} out of 5</strong>
                    <span style={{ color: '#5c6e63' }}>({product.reviewCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Review Submission Form if Eligible */}
              {user ? (
                eligibility.eligible ? (
                  <div style={{ backgroundColor: '#f4f9f6', padding: '1.5rem', borderRadius: '16px', border: '1px solid #c8d6ce', marginBottom: '2rem' }}>
                    <h4 style={{ color: '#1b4332', fontSize: '1.05rem', marginBottom: '0.5rem' }}>Leave a Customer Review</h4>
                    <p style={{ fontSize: '0.85rem', color: '#5c6e63', marginBottom: '1rem' }}>You purchased this item in order #{eligibility.orderNumber}. Share your experience with other customers!</p>

                    {reviewMsg && (
                      <div style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', backgroundColor: reviewMsg.type === 'error' ? '#fde8e8' : '#d8f3dc', color: reviewMsg.type === 'error' ? '#9b1c1c' : '#1b4332' }}>
                        {reviewMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleSubmitReview}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Your Rating</label>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Star size={24} fill={star <= newRating ? '#ffb703' : 'none'} color="#ffb703" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1b4332', marginBottom: '0.3rem' }}>Title (Optional)</label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Summarize your experience..."
                          maxLength={100}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem' }}
                        />
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1b4332' }}>Review *</label>
                          <span style={{ fontSize: '0.75rem', color: '#8e9e94' }}>{newComment.length}/1000</span>
                        </div>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write your honest opinion about quality, freshness, and effectiveness..."
                          rows={3}
                          maxLength={1000}
                          required
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #c8d6ce', fontSize: '0.9rem', resize: 'vertical' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div style={{ padding: '1rem 1.25rem', backgroundColor: '#f0f4f1', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.85rem', color: '#5c6e63', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={18} color="#52b788" />
                    <span>{eligibility.message || 'Only customers who have purchased and received this product can submit a review.'}</span>
                  </div>
                )
              ) : (
                <div style={{ padding: '1rem 1.25rem', backgroundColor: '#f0f4f1', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.85rem', color: '#5c6e63' }}>
                  Please <Link to="/login" style={{ color: '#1b4332', fontWeight: 700 }}>Log In</Link> to post a customer review if you have purchased this product.
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p style={{ color: '#8e9e94', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                  No approved customer reviews yet. Be the first verified buyer to leave a review!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div key={rev._id} style={{ borderBottom: '1px solid #e2e8e4', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1b4332', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                            {(rev.user?.name || 'Customer').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#1b4332', display: 'block' }}>{rev.user?.name || 'Verified Buyer'}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#8e9e94' }}>
                              {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', color: '#ffb703' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} fill={star <= rev.rating ? '#ffb703' : 'none'} color="#ffb703" />
                          ))}
                        </div>
                      </div>

                      {rev.title && <h5 style={{ fontSize: '0.95rem', color: '#1b4332', margin: '0.3rem 0' }}>{rev.title}</h5>}
                      <p style={{ fontSize: '0.9rem', color: '#2d3748', margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
                    </div>
                  ))}

                  {hasMoreReviews && (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                      <button
                        onClick={() => fetchProductReviews(reviewPage + 1)}
                        disabled={reviewsLoading}
                        style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: '1px solid #c8d6ce', background: '#none', color: '#1b4332', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
