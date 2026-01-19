const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    invoiceNo: { type: String, required: true }, // Not necessarily unique across all purchases (vendor specific), but for internal ref maybe unique ??
    // Let's assume user enters vendor's invoice no.
    billNo: { type: String }, // Internal ref no if any
    date: { type: Date, required: true },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partyName: { type: String },
    
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        hsn: { type: String },
        qty: { type: Number, required: true },
        unit: { type: String },
        mrp: { type: Number, default: 0 },
        rate: { type: Number, required: true }, // Purchase Rate
        discount: { type: Number, default: 0 },
        gstRate: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    
    subtotal: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    overallDiscount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    balanceAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    paymentMethod: { type: String },
    
    notes: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Purchase', purchaseSchema);
