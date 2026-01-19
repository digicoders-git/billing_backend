const Godown = require('../models/Godown');

const getGodowns = async (req, res) => {
    try {
        const godowns = await Godown.find({}).sort({ createdAt: -1 });
        res.json(godowns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGodown = async (req, res) => {
    try {
        const { name, address, city, pincode } = req.body;

        if (!name || name.trim().length < 3 || !/[a-zA-Z]/.test(name)) {
            return res.status(400).json({ message: 'Valid warehouse name (min 3 chars with letters) is required' });
        }

        if (!address || address.trim().length < 5) {
            return res.status(400).json({ message: 'Detailed address is required' });
        }

        if (!city || city.trim().length < 2) {
            return res.status(400).json({ message: 'Valid city is required' });
        }

        if (!pincode || !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: 'Valid 6-digit pincode is required' });
        }

        const godown = new Godown(req.body);
        const createdGodown = await godown.save();
        res.status(201).json(createdGodown);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateGodown = async (req, res) => {
    try {
        const { name, address, city, pincode } = req.body;
        const godown = await Godown.findById(req.params.id);
        
        if (!godown) {
            return res.status(404).json({ message: 'Godown not found' });
        }

        if (name !== undefined) {
            if (name.trim().length < 3 || !/[a-zA-Z]/.test(name)) {
                return res.status(400).json({ message: 'Valid warehouse name (min 3 chars) is required' });
            }
            godown.name = name;
        }

        if (address !== undefined) {
            if (address.trim().length < 5) {
                return res.status(400).json({ message: 'Detailed address is required' });
            }
            godown.address = address;
        }

        if (city !== undefined) {
            if (city.trim().length < 2) {
                return res.status(400).json({ message: 'Valid city is required' });
            }
            godown.city = city;
        }

        if (pincode !== undefined) {
            if (!/^\d{6}$/.test(pincode)) {
                return res.status(400).json({ message: 'Valid 6-digit pincode is required' });
            }
            godown.pincode = pincode;
        }

        if (req.body.state !== undefined) godown.state = req.body.state;
        if (req.body.type !== undefined) godown.type = req.body.type;
        
        const updatedGodown = await godown.save();
        res.json(updatedGodown);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteGodown = async (req, res) => {
    try {
        const result = await Godown.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: 'Godown removed' });
        } else {
            res.status(404).json({ message: 'Godown not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGodowns, createGodown, updateGodown, deleteGodown };
