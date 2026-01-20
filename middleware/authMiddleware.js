const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            let user = await User.findById(decoded.id).select('-password');

            // If not found in User, check Branch
            if (!user) {
                const Branch = require('../models/Branch');
                user = await Branch.findById(decoded.id).select('-password');
                if (user) {
                    // Add a virtual role for consistency if needed, usually branches are managers
                    user.role = 'branch_manager'; 
                    // Add branch identifier for consistency
                    user.branch = user.name;
                }
            }
            
            req.user = user;

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Check if account is active (specifically for branches)
            if (req.user.hasOwnProperty('isActive') && req.user.isActive === false) {
                 return res.status(401).json({ message: 'Account is inactive. Please contact admin.' });
            }

            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
