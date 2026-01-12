const express = require('express');
const router = express.Router();
const { markAttendance, getStaffAttendance, getDailyAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/daily', protect, getDailyAttendance);
router.get('/:staffId', protect, getStaffAttendance);

module.exports = router;
