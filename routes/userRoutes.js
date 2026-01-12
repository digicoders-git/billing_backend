const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    updateUserProfile,
    getUserProfile,
    changePassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', registerUser); // Ideally protect this Route so only admin can create users
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.get('/', protect, admin, getAllUsers);

module.exports = router;
