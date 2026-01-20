const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public (should be Admin only in production)
const registerUser = async (req, res) => {
    const { name, email, username, password, role, branch } = req.body;

    if (!name || (!email && !username) || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ 
        $or: [{ email: email || '' }, { username: username || '' }]
    });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email: email || `${username}@example.com`, // Fallback email
        username,
        password: hashedPassword,
        role: role || 'staff',
        branch: branch || 'Main'
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            branch: user.branch,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const Branch = require('../models/Branch');

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    // Use either email or username as the identifier
    const rawIdentifier = email || username;

    if (!rawIdentifier || !password) {
        return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    const loginIdentifier = rawIdentifier.trim();

    // 1. Try to find in User collection
    // Note: Emails should ideally be stored lowercase, but we search as-is first
    let user = await User.findOne({
        $or: [
            { email: loginIdentifier },
            { username: loginIdentifier }
        ]
    });

    if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            branch: user.branch,
            token: generateToken(user._id),
        });
    }

    // 2. If not found in User, try Branch collection
    const branch = await Branch.findOne({
        $or: [
            { username: loginIdentifier },
            { 'contact.email': loginIdentifier }
        ]
    });

    if (branch) {
        if (branch.isActive === false) {
             return res.status(401).json({ message: 'Branch account is inactive' });
        }

        if (await bcrypt.compare(password, branch.password)) {
            return res.json({
                _id: branch.id,
                name: branch.name, // Branch Name
                email: branch.contact?.email || '',
                username: branch.username,
                role: 'branch_manager',
                branch: branch.name, // The branch name itself
                branchId: branch.id,
                permissions: branch.permissions,
                token: generateToken(branch._id),
                isBranch: true
            });
        }
    }

    res.status(400).json({ message: 'Invalid credentials' });
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    let user = await User.findById(req.user._id);

    // If not in User, check Branch
    if (!user) {
        const Branch = require('../models/Branch');
        const branch = await Branch.findById(req.user._id);
        
        if (branch) {
            // Update Branch Profile
            if (req.body.name) branch.name = req.body.name;
            if (req.body.username && req.body.username !== branch.username) {
                 const existing = await Branch.findOne({ username: req.body.username });
                 if (existing) return res.status(400).json({ message: 'Username already exists' });
                 branch.username = req.body.username;
            }
            
            // Update contact info
            if (!branch.contact) branch.contact = {};
            if (req.body.email) branch.contact.email = req.body.email;
            if (req.body.phone) branch.contact.phone = req.body.phone;

            // Handle address (simple string to street mapping for simplified profile view)
            if (req.body.address) {
                if (!branch.address) branch.address = {};
                branch.address.street = req.body.address; // simple mapping
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                branch.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedBranch = await branch.save();
            
            // Format address for response
            const addressStr = updatedBranch.address ? 
                [updatedBranch.address.street, updatedBranch.address.city, updatedBranch.address.state]
                .filter(Boolean).join(', ') : '';

            return res.json({
                _id: updatedBranch._id,
                name: updatedBranch.name,
                email: updatedBranch.contact?.email || '',
                username: updatedBranch.username,
                phone: updatedBranch.contact?.phone || '',
                businessName: '', // Branches use main business name usually
                gstin: '',
                address: addressStr,
                role: 'branch_manager',
                branch: updatedBranch.name,
                token: generateToken(updatedBranch._id),
            });
        }
        return res.status(404).json({ message: 'User not found' });
    }

    // Standard User Update
    if (user) {
        // Check if email is being changed and if it already exists
        if (req.body.email && req.body.email !== user.email) {
            const userExists = await User.findOne({ email: req.body.email });
             if (userExists) {
                 return res.status(400).json({ message: 'Email already exists' });
             }
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.username = req.body.username || user.username;
        user.phone = req.body.phone || user.phone;
        user.businessName = req.body.businessName || user.businessName;
        user.gstin = req.body.gstin || user.gstin;
        user.address = req.body.address || user.address;
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            username: updatedUser.username,
            phone: updatedUser.phone,
            businessName: updatedUser.businessName,
            gstin: updatedUser.gstin,
            address: updatedUser.address,
            role: updatedUser.role,
            branch: updatedUser.branch,
            token: generateToken(updatedUser._id),
        });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                phone: user.phone || '',
                businessName: user.businessName || '',
                gstin: user.gstin || '',
                address: user.address || '',
                role: user.role,
                branch: user.branch
            });
        } 
        
        // Check Branch
        const Branch = require('../models/Branch');
        const branch = await Branch.findById(req.user._id).select('-password');

        if (branch) {
            // Format address to string
            const addressStr = branch.address ? 
                [branch.address.street, branch.address.city, branch.address.state, branch.address.pincode]
                .filter(Boolean).join(', ') : '';

            return res.json({
                _id: branch._id,
                name: branch.name,
                email: branch.contact?.email || '',
                username: branch.username,
                phone: branch.contact?.phone || '',
                businessName: branch.name, // Use branch name as business name context
                gstin: '', // Branches usually inherit
                address: addressStr,
                role: 'branch_manager',
                branch: branch.name
            });
        }

        res.status(404).json({ message: 'User not found' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        let user = await User.findById(req.user._id);
        let isBranch = false;

        if (!user) {
             const Branch = require('../models/Branch');
             user = await Branch.findById(req.user._id);
             isBranch = true;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    updateUserProfile,
    getUserProfile,
    changePassword,
};
