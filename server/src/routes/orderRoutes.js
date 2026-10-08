const express = require('express');
const router = express.Router();
const {
  previewOrder,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { preventCache } = require('../middleware/cacheMiddleware');
const { validatePreviewOrder, validateCreateOrder } = require('../validators/orderValidator');

// Strict anti-caching & Authentication required for all Order operations
router.use(protect);
router.use(preventCache);

router.post('/preview', validatePreviewOrder, previewOrder);
router.post('/', validateCreateOrder, createOrder);
router.get('/', getUserOrders);
router.get('/:orderNumber', getOrderByNumber);
router.post('/:orderNumber/cancel', cancelOrder);

module.exports = router;
