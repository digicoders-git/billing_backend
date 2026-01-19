const ItemCategory = require('../models/ItemCategory');

// @desc    Get all item categories
// @route   GET /api/item-categories
const getCategories = async (req, res) => {
    try {
        const categories = await ItemCategory.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an item category
// @route   POST /api/item-categories
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const categoryExists = await ItemCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await ItemCategory.create({ name });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an item category
// @route   PUT /api/item-categories/:id
const updateCategory = async (req, res) => {
    try {
        const category = await ItemCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = req.body.name || category.name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an item category
// @route   DELETE /api/item-categories/:id
const deleteCategory = async (req, res) => {
    try {
        const category = await ItemCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
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
