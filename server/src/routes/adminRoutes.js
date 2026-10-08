const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getRevenueTrend,
  getAdminProducts,
  getAdminInventory,
  updateAdminInventory,
  getAdminOrders,
  getAdminOrderDetail,
  updateAdminOrderStatus,
  getAdminCustomers,
  getAdminCustomerDetail,
  toggleCustomerStatus,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  getAdminReviews,
  updateReviewStatus,
  deleteAdminReview,
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  getSalesReport,
  getInventoryReport,
  getAdminSettings,
  updateAdminSettings,
} = require('../controllers/adminController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { preventCache } = require('../middleware/cacheMiddleware');

// All Admin Endpoints Require Authentication + Admin Role + Anti-Caching
router.use(protect);
router.use(authorizeRoles('admin', 'ADMIN'));
router.use(preventCache);

// Dashboard & Metrics
router.get('/dashboard', getDashboardMetrics);
router.get('/dashboard/revenue', getRevenueTrend);

// Product & Inventory Management
router.get('/products', getAdminProducts);
router.get('/inventory', getAdminInventory);
router.patch('/inventory/:id', updateAdminInventory);

// Order Management
router.get('/orders', getAdminOrders);
router.get('/orders/:orderNumber', getAdminOrderDetail);
router.patch('/orders/:orderNumber/status', updateAdminOrderStatus);

// Customer Management
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomerDetail);
router.patch('/customers/:id/status', toggleCustomerStatus);

// Coupon Management
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createAdminCoupon);
router.patch('/coupons/:id', updateAdminCoupon);
router.delete('/coupons/:id', deleteAdminCoupon);

// Review Moderation
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteAdminReview);

// Banner Management
router.get('/banners', getAdminBanners);
router.post('/banners', createAdminBanner);
router.patch('/banners/:id', updateAdminBanner);
router.delete('/banners/:id', deleteAdminBanner);

// Reports
router.get('/reports/sales', getSalesReport);
router.get('/reports/inventory', getInventoryReport);

// Store Settings
router.get('/settings', getAdminSettings);
router.patch('/settings', updateAdminSettings);

module.exports = router;
