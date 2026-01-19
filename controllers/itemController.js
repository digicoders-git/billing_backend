const Item = require('../models/Item');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    try {
        const items = await Item.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an item
// @route   POST /api/items
// @access  Public
const createItem = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Item name is required' });
        }

        if (!/[a-zA-Z]/.test(name)) {
            return res.status(400).json({ message: 'Item name must contain at least one letter' });
        }

        const item = new Item(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Public
const updateItem = async (req, res) => {
    try {
        const { name } = req.body;

        if (name !== undefined) {
            if (!name || name.trim() === '') {
                return res.status(400).json({ message: 'Item name is required' });
            }
            if (!/[a-zA-Z]/.test(name)) {
                return res.status(400).json({ message: 'Item name must contain at least one letter' });
            }
        }

        const item = await Item.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Public
const deleteItem = async (req, res) => {
    try {
        const result = await Item.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
