const PartyCategory = require('../models/PartyCategory');

// @desc    Get all party categories
// @route   GET /api/party-categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await PartyCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a party category
// @route   POST /api/party-categories
// @access  Public
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const categoryExists = await PartyCategory.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await PartyCategory.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a party category
// @route   PUT /api/party-categories/:id
// @access  Public
const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await PartyCategory.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a party category
// @route   DELETE /api/party-categories/:id
// @access  Public
const deleteCategory = async (req, res) => {
    try {
        const category = await PartyCategory.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
