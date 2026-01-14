const ExpenseCategory = require('../models/ExpenseCategory');

// @desc    Get all categories
// @route   GET /api/expense-categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await ExpenseCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add new category
// @route   POST /api/expense-categories
// @access  Public
const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        let category = await ExpenseCategory.findOne({ name });
        if (category) {
            return res.status(400).json({ msg: 'Category already exists' });
        }

        category = new ExpenseCategory({ name });
        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update category
// @route   PUT /api/expense-categories/:id
// @access  Public
const updateCategory = async (req, res) => {
    const { name } = req.body;
    try {
        let category = await ExpenseCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        category.name = name;
        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete category
// @route   DELETE /api/expense-categories/:id
// @access  Public
const deleteCategory = async (req, res) => {
    try {
        const category = await ExpenseCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        await ExpenseCategory.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory
};
