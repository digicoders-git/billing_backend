const Party = require('../models/Party');

// @desc    Get all parties
// @route   GET /api/parties
// @access  Public
const getParties = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const parties = await Party.find(filter).sort({ createdAt: -1 });
        res.json(parties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single party
// @route   GET /api/parties/:id
// @access  Public
const getPartyById = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (party) {
            res.json(party);
        } else {
            res.status(404).json({ message: 'Party not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a party
// @route   POST /api/parties
// @access  Public
const createParty = async (req, res) => {
    try {
        const party = new Party(req.body);
        const createdParty = await party.save();
        res.status(201).json(createdParty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a party
// @route   PUT /api/parties/:id
// @access  Public
const updateParty = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (party) {
            Object.assign(party, req.body);
            const updatedParty = await party.save();
            res.json(updatedParty);
        } else {
            res.status(404).json({ message: 'Party not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a party
// @route   DELETE /api/parties/:id
// @access  Public
const deleteParty = async (req, res) => {
    try {
        const party = await Party.findById(req.params.id);
        if (party) {
            await party.remove();
            res.json({ message: 'Party removed' });
        } else {
            res.status(404).json({ message: 'Party not found' });
        }
    } catch (error) {
        // Party.remove() is deprecated in newer Mongoose, use deleteOne
        try {
             await Party.deleteOne({ _id: req.params.id });
             res.json({ message: 'Party removed' });
        } catch (e) {
             res.status(500).json({ message: e.message });
        }
    }
};

module.exports = {
    getParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
};
