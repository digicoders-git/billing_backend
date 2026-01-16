const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    expenseNumber: {
        type: String,
        required: true
    },
    originalInvoiceNumber: {
        type: String
    },
    partyName: { 
        type: String,
        required: false 
    },
    
    // GST Fields
    gstEnabled: {
        type: Boolean,
        default: false
    },
    gstInNumber: { // New: Party's GSTIN
        type: String
    },
    gstRate: { // New: 5, 12, 18, 28
        type: Number,
        default: 0
    },
    gstFullAmount: { // New: The calculated tax amount
        type: Number,
        default: 0
    },
    cgst: { // Central GST (for intra-state)
        type: Number,
        default: 0
    },
    sgst: { // State GST (for intra-state)
        type: Number,
        default: 0
    },
    igst: { // Integrated GST (for inter-state)
        type: Number,
        default: 0
    },
    taxableAmount: { // New: Amount before tax
        type: Number,
        default: 0
    },
    taxType: { // New: 'Inclusive' or 'Exclusive'
        type: String,
        enum: ['Inclusive', 'Exclusive'],
        default: 'Exclusive'
    },
    stateOfSupply: { // New: For IGST vs CGST/SGST determination (logic often on frontend, but good to store)
        type: String
    },

    category: {
        type: String,
        required: true
    },
    items: [{
        name: { type: String, required: true },
        amount: { type: Number, required: true }
    }],
    totalAmount: { 
        type: Number,
        required: true
    },
    amount: { 
        type: Number
    },
    paymentMode: {
        type: String,
        default: 'Cash'
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: false
    },
    description: {
        type: String
    },
    createdBy: {
        type: String,
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
