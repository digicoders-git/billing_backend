const express = require('express');
const router = express.Router();
const { 
    getPayments, 
    createPayment, 
    deletePayment, 
    getPaymentStats, 
    getNextReceiptNumber,
    getPaymentById,
    updatePayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getPaymentStats);
router.get('/next-receipt', protect, getNextReceiptNumber);

router.route('/')
    .get(protect, getPayments)
    .post(protect, createPayment);

router.route('/:id')
    .get(protect, getPaymentById)
    .put(protect, updatePayment)
    .delete(protect, deletePayment);

module.exports = router;
