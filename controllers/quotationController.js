const Quotation = require('../models/Quotation');

const getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find({}).populate('party', 'name').sort({ createdAt: -1 });
        res.json(quotations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate('party');
        if (quotation) {
            res.json(quotation);
        } else {
            res.status(404).json({ message: 'Quotation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createQuotation = async (req, res) => {
    try {
        const quotation = new Quotation(req.body);
        const createdQuotation = await quotation.save();
        res.status(201).json(createdQuotation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (quotation) {
            Object.assign(quotation, req.body);
            const updatedQuotation = await quotation.save();
            res.json(updatedQuotation);
        } else {
            res.status(404).json({ message: 'Quotation not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteQuotation = async (req, res) => {
    try {
        const result = await Quotation.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: 'Quotation removed' });
        } else {
            res.status(404).json({ message: 'Quotation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getQuotations,
    getQuotationById,
    createQuotation,
    updateQuotation,
    deleteQuotation,
};
