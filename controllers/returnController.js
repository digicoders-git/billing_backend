const Return = require('../models/Return');
const Item = require('../models/Item');

const getReturns = async (req, res) => {
    try {
        const returns = await Return.find({}).populate('party', 'name').sort({ createdAt: -1 });
        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReturnById = async (req, res) => {
    try {
        const returnData = await Return.findById(req.params.id).populate('party');
        if (returnData) {
            res.json(returnData);
        } else {
            res.status(404).json({ message: 'Return not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReturn = async (req, res) => {
    try {
        const { items, type } = req.body;
        const returnData = new Return(req.body);
        const createdReturn = await returnData.save();

        if (items && items.length > 0) {
            for (const item of items) {
                if (item.itemId) {
                    const product = await Item.findById(item.itemId);
                    if (product) {
                        if (type === 'Sales Return' || type === 'Credit Note') {
                            product.stock = product.stock + item.qty; // Goods come back
                        } else if (type === 'Purchase Return' || type === 'Debit Note') {
                            product.stock = product.stock - item.qty; // Goods leave
                        }
                        await product.save();
                    }
                }
            }
        }

        res.status(201).json(createdReturn);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReturn = async (req, res) => {
    try {
        const returnData = await Return.findById(req.params.id);
        if (returnData) {
            const { items, type } = returnData;
             if (items && items.length > 0) {
                for (const item of items) {
                    if (item.itemId) {
                        const product = await Item.findById(item.itemId);
                        if (product) {
                            if (type === 'Sales Return' || type === 'Credit Note') {
                                product.stock = product.stock - item.qty; // Revert
                            } else if (type === 'Purchase Return' || type === 'Debit Note') {
                                product.stock = product.stock + item.qty; // Revert
                            }
                            await product.save();
                        }
                    }
                }
            }
            await Return.deleteOne({ _id: req.params.id });
            res.json({ message: 'Return removed' });
        } else {
            res.status(404).json({ message: 'Return not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReturnStats = async (req, res) => {
    try {
        const { type = 'Sales Return' } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Returns Today
        const todaysReturns = await Return.aggregate([
            { 
                $match: { 
                    type: type,
                    date: { $gte: today }
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                } 
            }
        ]);

        // 2. Total Returns (All Time)
        const totalReturns = await Return.aggregate([
             { 
                $match: { 
                    type: type
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                } 
            }
        ]);

        res.json({
             todayCount: todaysReturns[0]?.count || 0,
             todayAmount: todaysReturns[0]?.totalAmount || 0,
             totalCount: totalReturns[0]?.count || 0,
             totalAmount: totalReturns[0]?.totalAmount || 0
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNextReturnNumber = async (req, res) => {
    try {
        const { type } = req.query; // 'Sales Return' or 'Purchase Return'
        const lastReturn = await Return.findOne({ type }).sort({ createdAt: -1 });
        let nextNo = 1;
        if (lastReturn && lastReturn.returnNo) {
            const num = parseInt(lastReturn.returnNo.replace(/\D/g, ''));
            if (!isNaN(num)) {
                nextNo = num + 1;
            }
        }
        res.json({ nextNo: nextNo.toString() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const { items: newItems, type } = req.body;
        
        const oldReturn = await Return.findById(id);
        if (!oldReturn) {
            return res.status(404).json({ message: 'Return not found' });
        }

        // 1. Revert Old Stock
        if (oldReturn.items && oldReturn.items.length > 0) {
             for (const item of oldReturn.items) {
                if (item.itemId) {
                    const product = await Item.findById(item.itemId);
                    if (product) {
                        if (oldReturn.type === 'Sales Return' || oldReturn.type === 'Credit Note') {
                            product.stock = product.stock - item.qty; // Revert: Remove added stock
                        } else if (oldReturn.type === 'Purchase Return' || oldReturn.type === 'Debit Note') {
                            product.stock = product.stock + item.qty; // Revert: Add back removed stock
                        }
                        await product.save();
                    }
                }
            }
        }

        // 2. Apply New Stock
        if (newItems && newItems.length > 0) {
             for (const item of newItems) {
                if (item.itemId) {
                    const product = await Item.findById(item.itemId);
                    if (product) {
                         if (type === 'Sales Return' || type === 'Credit Note') {
                            product.stock = product.stock + item.qty; // Re-Apply: Add stock
                        } else if (type === 'Purchase Return' || type === 'Debit Note') {
                            product.stock = product.stock - item.qty; // Re-Apply: Remove stock
                        }
                        await product.save();
                    }
                }
            }
        }

        // 3. Update Document
        const updatedReturn = await Return.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedReturn);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReturns,
    getReturnById,
    createReturn,
    deleteReturn,
    getReturnStats,
    getNextReturnNumber,
    updateReturn
};
