const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' }
    },
    contact: {
        phone: String,
        email: String,
        manager: String
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    permissions: [{
        module: {
            type: String,
            enum: [
                'Dashboard', 'Parties', 'Items', 'Sales', 'Purchases', 
                'Payments', 'Reports', 'Settings', 'Users', 'Branches',
                'Invoices', 'Quotations', 'Returns', 'Godowns', 'Staff'
            ],
            required: true
        },
        actions: {
            view: { type: Boolean, default: true },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    settings: {
        allowNegativeStock: { type: Boolean, default: false },
        autoBackup: { type: Boolean, default: true },
        printAfterSave: { type: Boolean, default: false },
        gstEnabled: { type: Boolean, default: true }
    },
    stats: {
        totalSales: { type: Number, default: 0 },
        totalPurchases: { type: Number, default: 0 },
        totalInvoices: { type: Number, default: 0 },
        totalCustomers: { type: Number, default: 0 }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
branchSchema.index({ code: 1 });
branchSchema.index({ username: 1 });
branchSchema.index({ isActive: 1 });

module.exports = mongoose.model('Branch', branchSchema);
