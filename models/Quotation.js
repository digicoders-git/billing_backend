const mongoose = require('mongoose');

const quotationSchema = mongoose.Schema({
    quotationNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    validFor: { type: Number, default: 30 },
    validityDate: { type: Date },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    partyName: { type: String },
    
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        hsn: { type: String },
        qty: { type: Number, required: true },
        unit: { type: String },
        rate: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    
    subtotal: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    overallDiscount: { type: Number, default: 0 },
    overallDiscountType: { type: String, enum: ['fixed', 'percentage'], default: 'percentage' },
    totalAmount: { type: Number, required: true },
    
    status: { type: String, enum: ['Open', 'Expired', 'Converted'], default: 'Open' },
    
    notes: { type: String },
    terms: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quotation', quotationSchema);
