const Purchase = require('../models/Purchase');
const Item = require('../models/Item');

const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({ user: req.user._id })
            .populate('party', 'name')
            .sort({ createdAt: -1 });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user._id }).populate('party');
        if (purchase) {
            res.json(purchase);
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPurchase = async (req, res) => {
    try {
        const { items } = req.body;
        const purchase = new Purchase({
            ...req.body,
            user: req.user._id
        });
        const createdPurchase = await purchase.save();

        // Increase Stock
        // Note: Ideally stock updates should also check user ownership if items are user-specific
        if (items && items.length > 0) {
            for (const item of items) {
                if (item.itemId) {
                    const product = await Item.findOne({ _id: item.itemId, user: req.user._id });
                    if (product) {
                        product.stock = (product.stock || 0) + (parseFloat(item.qty) || 0);
                        await product.save();
                    }
                }
            }
        }

        res.status(201).json(createdPurchase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user._id });
        if (purchase) {
            // NOTE: Complex stock handling needed here if items changed. 
            // For now, assuming basic update. Ideally, we should reverse old stock and add new stock.
            Object.assign(purchase, req.body);
            const updatedPurchase = await purchase.save();
            res.json(updatedPurchase);
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user._id });
        if (purchase) {
             // Decrease Stock (Reverse operation)
            if (purchase.items && purchase.items.length > 0) {
                for (const item of purchase.items) {
                    if (item.itemId) {
                        const product = await Item.findOne({ _id: item.itemId, user: req.user._id });
                        if (product) {
                            product.stock = (product.stock || 0) - (parseFloat(item.qty) || 0);
                            await product.save();
                        }
                    }
                }
            }

            await Purchase.deleteOne({ _id: req.params.id });
            res.json({ message: 'Purchase removed' });
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPurchases,
    getPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase,
};
