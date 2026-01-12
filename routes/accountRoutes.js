const express = require('express');
const router = express.Router();
const {
    getAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount
} = require('../controllers/accountController');

router.route('/').get(getAccounts).post(createAccount);
router.route('/:id').get(getAccountById).delete(deleteAccount).put(updateAccount);

module.exports = router;
