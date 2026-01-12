const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Cash', 'Bank', 'UPI'], default: 'Cash' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    // Bank Details
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    branch: { type: String },
    // Financials
    openingBalance: { type: Number, default: 0 },
    balanceType: { type: String, enum: ['debit', 'credit'], default: 'debit' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
