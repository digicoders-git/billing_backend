const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    businessName: { type: String },
    gstin: { type: String },
    address: { type: String },
    role: { type: String, enum: ['admin', 'branch_manager', 'staff'], default: 'staff' },
    branch: { type: String, default: 'Main' }, // Could be linked to Godown ID later
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
