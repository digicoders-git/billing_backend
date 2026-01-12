const mongoose = require('mongoose');

const partySchema = mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String },
    email: { type: String },
    openingBalance: { type: Number, default: 0 },
    balanceType: { type: String, enum: ['To Collect', 'To Pay'], default: 'To Collect' },
    gstin: { type: String },
    pan: { type: String },
    type: { type: String, enum: ['Customer', 'Supplier'], required: true },
    category: { type: String },
    billingAddress: { type: String },
    shippingAddress: { type: String },
    creditPeriod: { type: Number, default: 30 },
    creditLimit: { type: Number, default: 0 },
    contactPerson: { type: String },
    dob: { type: Date },
    bankAccount: {
        accountNo: { type: String },
        ifsc: { type: String },
        bankName: { type: String },
        holderName: { type: String },
        upi: { type: String }
    },
    customFieldCategory: { type: String },
    customFieldValue: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Party', partySchema);
