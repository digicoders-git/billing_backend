const mongoose = require('mongoose');

const returnSchema = mongoose.Schema({
    returnNo: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Sales Return', 'Purchase Return', 'Credit Note', 'Debit Note'], required: true },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    partyName: { type: String },
    originalInvoiceNo: { type: String }, // Optional reference
    reason: { type: String }, // For Credit/Debit notes
    
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        hsn: { type: String },
        qty: { type: Number, required: true },
        unit: { type: String },
        rate: { type: Number, required: true },
        tax: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    
    subtotal: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    overallDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    roundOffDiff: { type: Number, default: 0 },
    
    notes: { type: String },
    terms: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Return', returnSchema);
