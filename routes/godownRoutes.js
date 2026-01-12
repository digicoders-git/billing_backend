const express = require('express');
const router = express.Router();
const { getGodowns, createGodown, updateGodown, deleteGodown } = require('../controllers/godownController');

router.route('/').get(getGodowns).post(createGodown);
router.route('/:id').put(updateGodown).delete(deleteGodown);

module.exports = router;
