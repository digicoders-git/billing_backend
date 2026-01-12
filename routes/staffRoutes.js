const express = require('express');
const router = express.Router();
const {
    getStaff,
    createStaff,
    deleteStaff,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStaff).post(protect, createStaff);
router.route('/:id').delete(protect, deleteStaff);

module.exports = router;
