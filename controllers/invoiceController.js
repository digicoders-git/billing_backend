const Invoice = require('../models/Invoice');
const Item = require('../models/Item');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({})
            .populate('party', 'name')
            .sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Public
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('party');
        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Public
const createInvoice = async (req, res) => {
    try {
        const { items } = req.body;

        // Create Invoice
        const invoice = new Invoice(req.body);
        const createdInvoice = await invoice.save();

        // Update Stock
        if (items && items.length > 0) {
            for (const item of items) {
                if (item.itemId) {
                    const product = await Item.findById(item.itemId);
                    if (product) {
                        product.stock = product.stock - item.qty;
                        await product.save();
                    }
                }
            }
        }

        res.status(201).json(createdInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Public
const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            // NOTE: Complex logic needed here to reverse previous stock impact and apply new one.
            // For now, simple update. Full stock management in update is complex.
            
            Object.assign(invoice, req.body);
            const updatedInvoice = await invoice.save();
            res.json(updatedInvoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Public
const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        
        if (invoice) {
            // Restore Stock
            if (invoice.items && invoice.items.length > 0) {
                for (const item of invoice.items) {
                    if (item.itemId) {
                        const product = await Item.findById(item.itemId);
                        if (product) {
                            product.stock = product.stock + item.qty;
                            await product.save();
                        }
                    }
                }
            }

            await Invoice.deleteOne({ _id: req.params.id });
            res.json({ message: 'Invoice removed' });
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
};
