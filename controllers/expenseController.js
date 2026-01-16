const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .populate('accountId', 'name bankName type')
            .sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Public
const addExpense = async (req, res) => {
    // Destructure all possible fields
    const { 
        date, 
        expenseNumber, 
        originalInvoiceNumber, 
        partyName, 
        
        // GST Fields
        gstEnabled, 
        gstInNumber,
        gstRate,
        gstFullAmount,
        taxableAmount,
        taxType,
        stateOfSupply,

        category, 
        items, 
        totalAmount, 
        amount, 
        paymentMode,
        accountId, // New
        description 
    } = req.body;

    try {
        const newExpense = new Expense({
            date,
            expenseNumber,
            originalInvoiceNumber,
            partyName,
            
            gstEnabled,
            gstInNumber,
            gstRate,
            gstFullAmount,
            taxableAmount,
            taxType,
            stateOfSupply,

            category,
            items: items || [],
            totalAmount: totalAmount || amount || 0,
            amount: totalAmount || amount || 0, 
            paymentMode,
            accountId, // New
            description
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = async (req, res) => {
    const { 
        date, 
        expenseNumber, 
        originalInvoiceNumber, 
        partyName, 
        
        gstEnabled,
        gstInNumber,
        gstRate,
        gstFullAmount,
        taxableAmount,
        taxType,
        stateOfSupply,

        category, 
        items,
        totalAmount,
        amount, 
        paymentMode,
        accountId, // New
        description 
    } = req.body;

    // Build expense object
    const expenseFields = {};
    if (date) expenseFields.date = date;
    if (expenseNumber) expenseFields.expenseNumber = expenseNumber;
    if (originalInvoiceNumber !== undefined) expenseFields.originalInvoiceNumber = originalInvoiceNumber;
    if (partyName) expenseFields.partyName = partyName;
    
    // GST Updates
    expenseFields.gstEnabled = gstEnabled; // Always update boolean
    if (gstInNumber !== undefined) expenseFields.gstInNumber = gstInNumber;
    if (gstRate !== undefined) expenseFields.gstRate = gstRate;
    if (gstFullAmount !== undefined) expenseFields.gstFullAmount = gstFullAmount;
    if (taxableAmount !== undefined) expenseFields.taxableAmount = taxableAmount;
    if (taxType !== undefined) expenseFields.taxType = taxType;
    if (stateOfSupply !== undefined) expenseFields.stateOfSupply = stateOfSupply;

    if (category) expenseFields.category = category;
    if (items) expenseFields.items = items;
    if (totalAmount) expenseFields.totalAmount = totalAmount;
    if (amount) expenseFields.amount = amount;
    else if (totalAmount) expenseFields.amount = totalAmount; 
    if (paymentMode) expenseFields.paymentMode = paymentMode;
    if (accountId) expenseFields.accountId = accountId; // New
    if (description) expenseFields.description = description;

    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: expenseFields },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        await Expense.findByIdAndDelete(req.params.id); 

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Expense not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getExpenses,
    getExpenseById,
    addExpense,
    updateExpense,
    deleteExpense
};
