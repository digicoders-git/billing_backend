const express = require('express');
const router = express.Router();
const {
    getQuotations,
    getQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation,
} = require('../controllers/quotationController');

router.route('/').get(getQuotations).post(createQuotation);
router.route('/:id').get(getQuotationById).put(updateQuotation).delete(deleteQuotation);

module.exports = router;
