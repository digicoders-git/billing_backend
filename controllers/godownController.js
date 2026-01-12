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
        const godown = new Godown(req.body);
        const createdGodown = await godown.save();
        res.status(201).json(createdGodown);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateGodown = async (req, res) => {
    try {
        const godown = await Godown.findById(req.params.id);
        if (godown) {
            godown.name = req.body.name || godown.name;
            godown.address = req.body.address || godown.address;
            godown.state = req.body.state || godown.state;
            godown.pincode = req.body.pincode || godown.pincode;
            godown.city = req.body.city || godown.city;
            godown.type = req.body.type || godown.type;
            
            const updatedGodown = await godown.save();
            res.json(updatedGodown);
        } else {
            res.status(404).json({ message: 'Godown not found' });
        }
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
