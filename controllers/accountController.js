const Account = require('../models/Account');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({});
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
const getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
    try {
        const { 
            name, type, status, 
            bankName, accountNumber, ifsc, branch, 
            openingBalance, balanceType 
        } = req.body;

        const account = new Account({
            name, type, status,
            bankName, accountNumber, ifsc, branch,
            openingBalance, balanceType
        });

        const createdAccount = await account.save();
        res.status(201).json(createdAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        if (account) {
            await account.deleteOne();
            res.json({ message: 'Account removed' });
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update account balance or details
// @route   PUT /api/accounts/:id
// @access  Private
const updateAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);

        if (account) {
            account.name = req.body.name || account.name;
            account.status = req.body.status || account.status;
            account.bankName = req.body.bankName || account.bankName;
            account.accountNumber = req.body.accountNumber || account.accountNumber;
            account.ifsc = req.body.ifsc || account.ifsc;
            account.branch = req.body.branch || account.branch;
            
            if (req.body.openingBalance !== undefined) {
                account.openingBalance = req.body.openingBalance;
            }

            const updatedAccount = await account.save();
            res.json(updatedAccount);
        } else {
            res.status(404).json({ message: 'Account not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAccounts,
    getAccountById,
    createAccount,
    deleteAccount,
    updateAccount
};
