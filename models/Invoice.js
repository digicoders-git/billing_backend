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
        mrp: { type: Number, default: 0 },
        rate: { type: Number, required: true },
        discount: { type: Number, default: 0 }, // Percentage
        gstRate: { type: Number, default: 0 },
        gstAmount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        amount: { type: Number, required: true }
    }],
    
    // GST Fields
    gstEnabled: { type: Boolean, default: false },
    gstRate: { type: Number, default: 0 }, // 5, 12, 18, 28
    cgst: { type: Number, default: 0 }, // Central GST (for intra-state)
    sgst: { type: Number, default: 0 }, // State GST (for intra-state)
    igst: { type: Number, default: 0 }, // Integrated GST (for inter-state)
    gstAmount: { type: Number, default: 0 }, // Total GST amount
    taxType: { 
        type: String, 
        enum: ['Inclusive', 'Exclusive'], 
        default: 'Exclusive' 
    },
    stateOfSupply: { type: String }, // For IGST vs CGST/SGST determination
    
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
    terms: { type: String },
    
    // Track who created this invoice
    createdBy: { 
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
