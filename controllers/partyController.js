const Party = require('../models/Party');
const axios = require('axios');

// @desc    Get GSTIN details from external API
// @route   GET /api/parties/gstin/:gstin
// @access  Public
const getGstinDetails = async (req, res) => {
    try {
        const { gstin } = req.params;
        
        if (!gstin || gstin.length !== 15) {
            return res.status(400).json({ message: 'Invalid GSTIN. It must be 15 characters long.' });
        }

        // Try to fetch from a public GST search API
        // Note: For production use, it is recommended to use a paid API service (like ClearTax, Razorpay, or IRIS)
        // with a proper API key for reliability and volume.
        try {
            // Attempting to fetch from a public verification service
            const response = await axios.get(`https://app.getclear.in/api/v1/gstin/search?gstin=${gstin.toUpperCase()}`, {
                timeout: 10000
            });
            
            if (response.data) {
                const data = response.data;
                // Format the response to match our party schema
                const result = {
                    name: data.legal_name || data.trade_name || '',
                    billingAddress: data.address || '',
                    placeOfSupply: data.state || '',
                    pan: gstin.substring(2, 12).toUpperCase(),
                    gstin: gstin.toUpperCase(),
                    success: true
                };
                return res.json(result);
            }
        } catch (apiError) {
            console.error('External GST API Error:', apiError.message);
            // Fallback: If 3rd party API fails, return PAN extracted from GSTIN
            return res.json({
                name: '',
                billingAddress: '',
                placeOfSupply: '',
                pan: gstin.substring(2, 12).toUpperCase(),
                gstin: gstin.toUpperCase(),
                success: false,
                message: 'Auto-fetch failed, but PAN was extracted.'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
    getGstinDetails,
    getParties,
    getPartyById,
    createParty,
    updateParty,
    deleteParty,
};
