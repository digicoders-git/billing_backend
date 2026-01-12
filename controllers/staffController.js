const Staff = require('../models/Staff');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
// @desc    Get all staff
// @route   GET /api/staff
// @access  Private
const getStaff = async (req, res) => {
    try {
        const staff = await Staff.find({ user: req.user._id });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private
const createStaff = async (req, res) => {
    try {
        const { name, mobile, salaryType, salary, salaryCycle, openingBalance, balanceType } = req.body;
        
        const staff = new Staff({
            user: req.user._id,
            name,
            mobile,
            salaryType,
            salary,
            salaryCycle,
            openingBalance,
            balanceType
        });

        const createdStaff = await staff.save();
        res.status(201).json(createdStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (staff) {
            await staff.deleteOne();
            res.json({ message: 'Staff removed' });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStaff,
    createStaff,
    deleteStaff
};
