const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    paymentTerms: { type: Number, default: 0 },
    dueDate: { type: Date },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    partyName: { type: String },
    billingAddress: { type: String },
    
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: { type: String, required: true },
        code: { type: String },
        hsn: { type: String },
        qty: { type: Number, required: true },
        unit: { type: String },
        rate: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // Percentage
        tax: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    
    subtotal: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    overallDiscount: { type: Number, default: 0 },
    overallDiscountType: { type: String, enum: ['fixed', 'percentage'], default: 'percentage' },
    taxableAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    roundOffDiff: { type: Number, default: 0 },
    
    // Status can be: 'Draft', 'Paid', 'Unpaid', 'Partial', 'Overdue'
    status: { type: String, default: 'Unpaid' },
    
    amountReceived: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'Cash' },
    branch: { type: String, default: 'Main Branch' },
    
    notes: { type: String },
    terms: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
