const express = require('express');
const router = express.Router();
const {
    getPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    getNextPONumber
} = require('../controllers/purchaseOrderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/next-po', protect, getNextPONumber);
router.route('/').get(protect, getPurchaseOrders).post(protect, createPurchaseOrder);
router.route('/:id').get(protect, getPurchaseOrderById).put(protect, updatePurchaseOrder).delete(protect, deletePurchaseOrder);

module.exports = router;
