const Branch = require('../models/Branch');
const bcrypt = require('bcryptjs');

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
exports.getBranches = async (req, res) => {
    try {
        const branches = await Branch.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single branch
// @route   GET /api/branches/:id
// @access  Private
exports.getBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id).select('-password');
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new branch
// @route   POST /api/branches
// @access  Private
exports.createBranch = async (req, res) => {
    try {
        const { name, code, address, contact, username, password, permissions, settings } = req.body;

        // Check if branch code already exists
        const existingCode = await Branch.findOne({ code: code.toUpperCase() });
        if (existingCode) {
            return res.status(400).json({ message: 'Branch code already exists' });
        }

        // Check if username already exists
        const existingUsername = await Branch.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const branch = await Branch.create({
            name,
            code: code.toUpperCase(),
            address,
            contact,
            username,
            password: hashedPassword,
            permissions: permissions || [],
            settings: settings || {},
            createdBy: req.user?._id
        });

        // Return branch without password
        const branchData = branch.toObject();
        delete branchData.password;

        res.status(201).json(branchData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private
exports.updateBranch = async (req, res) => {
    try {
        const { name, code, address, contact, username, password, permissions, settings, isActive } = req.body;

        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        // Check if new code conflicts with another branch
        if (code && code.toUpperCase() !== branch.code) {
            const existingCode = await Branch.findOne({ 
                code: code.toUpperCase(), 
                _id: { $ne: req.params.id } 
            });
            if (existingCode) {
                return res.status(400).json({ message: 'Branch code already exists' });
            }
        }

        // Check if new username conflicts with another branch
        if (username && username !== branch.username) {
            const existingUsername = await Branch.findOne({ 
                username, 
                _id: { $ne: req.params.id } 
            });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            }
        }

        // Update fields
        if (name) branch.name = name;
        if (code) branch.code = code.toUpperCase();
        if (address) branch.address = { ...branch.address, ...address };
        if (contact) branch.contact = { ...branch.contact, ...contact };
        if (username) branch.username = username;
        if (permissions) branch.permissions = permissions;
        if (settings) branch.settings = { ...branch.settings, ...settings };
        if (typeof isActive !== 'undefined') branch.isActive = isActive;

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            branch.password = await bcrypt.hash(password, salt);
        }

        await branch.save();

        // Return branch without password
        const branchData = branch.toObject();
        delete branchData.password;

        res.json(branchData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private
exports.deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        await branch.deleteOne();
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update branch stats
// @route   PUT /api/branches/:id/stats
// @access  Private
exports.updateBranchStats = async (req, res) => {
    try {
        const { totalSales, totalPurchases, totalInvoices, totalCustomers } = req.body;

        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        if (typeof totalSales !== 'undefined') branch.stats.totalSales = totalSales;
        if (typeof totalPurchases !== 'undefined') branch.stats.totalPurchases = totalPurchases;
        if (typeof totalInvoices !== 'undefined') branch.stats.totalInvoices = totalInvoices;
        if (typeof totalCustomers !== 'undefined') branch.stats.totalCustomers = totalCustomers;

        await branch.save();

        const branchData = branch.toObject();
        delete branchData.password;

        res.json(branchData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle branch status
// @route   PUT /api/branches/:id/toggle-status
// @access  Private
exports.toggleBranchStatus = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        branch.isActive = !branch.isActive;
        await branch.save();

        const branchData = branch.toObject();
        delete branchData.password;

        res.json(branchData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get branch statistics
// @route   GET /api/branches/statistics
// @access  Private
exports.getBranchStatistics = async (req, res) => {
    try {
        const totalBranches = await Branch.countDocuments();
        const activeBranches = await Branch.countDocuments({ isActive: true });
        const inactiveBranches = totalBranches - activeBranches;

        const branches = await Branch.find().select('stats');
        const aggregateStats = branches.reduce((acc, branch) => {
            acc.totalSales += branch.stats.totalSales || 0;
            acc.totalPurchases += branch.stats.totalPurchases || 0;
            acc.totalInvoices += branch.stats.totalInvoices || 0;
            acc.totalCustomers += branch.stats.totalCustomers || 0;
            return acc;
        }, {
            totalSales: 0,
            totalPurchases: 0,
            totalInvoices: 0,
            totalCustomers: 0
        });

        res.json({
            totalBranches,
            activeBranches,
            inactiveBranches,
            aggregateStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
