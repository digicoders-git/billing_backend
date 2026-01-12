const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    receiptNo: { type: String, required: true }, // or Voucher No
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['Payment In', 'Payment Out'], required: true },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    partyName: { type: String },
    
    amount: { type: Number, required: true },
    paymentMode: { type: String, default: 'Cash' }, // Cash, Cheque, UPI, Bank Transfer
    referenceNo: { type: String }, // Cheque No / UPI ID
    
    linkedInvoices: [{
        invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, // or Purchase
        amountAdjusted: { type: Number }
    }],
    
    notes: { type: String },
    unusedAmount: { type: Number, default: 0 },
    branch: { type: String, default: 'Main Branch' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
