const express = require('express');
const router = express.Router();
const {
    getReturns,
    getReturnById,
    createReturn,
    deleteReturn,
    getReturnStats,
    getNextReturnNumber,
    updateReturn
} = require('../controllers/returnController');

router.get('/stats', getReturnStats);
router.get('/next-receipt', getNextReturnNumber);

router.route('/').get(getReturns).post(createReturn);
router.route('/:id').get(getReturnById).delete(deleteReturn).put(updateReturn);

module.exports = router;
