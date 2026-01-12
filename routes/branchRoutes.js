const express = require('express');
const router = express.Router();
const {
    getBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch,
    updateBranchStats,
    toggleBranchStatus,
    getBranchStatistics
} = require('../controllers/branchController');
const { protect } = require('../middleware/authMiddleware');

// Statistics route (must be before /:id routes)
router.get('/statistics', protect, getBranchStatistics);

// Main CRUD routes
router.route('/')
    .get(protect, getBranches)
    .post(protect, createBranch);

router.route('/:id')
    .get(protect, getBranch)
    .put(protect, updateBranch)
    .delete(protect, deleteBranch);

// Additional routes
router.put('/:id/stats', protect, updateBranchStats);
router.put('/:id/toggle-status', protect, toggleBranchStatus);

module.exports = router;
