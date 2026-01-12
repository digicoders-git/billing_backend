const mongoose = require('mongoose');

const purchaseOrderSchema = mongoose.Schema({
    orderNo: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    expiryDate: { type: Date },
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
    roundOffDiff: { type: Number, default: 0 },
    
    status: { type: String, enum: ['Draft', 'Pending', 'Approved', 'Delivered', 'Cancelled'], default: 'Pending' },
    
    notes: { type: String },
    terms: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
