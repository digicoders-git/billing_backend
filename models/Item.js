const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    unit: { type: String, default: 'PCS' },
    sellingPrice: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    mrp: { type: Number, default: 0 },
    wholesalePrice: { type: Number, default: 0 },
    minStock: { type: Number, default: 0 }, // Low Stock Alert
    godown: { type: String }, // Could be a ref to Godown model, but string for now based on simple usage
    batchNumber: { type: String },
    expiryDate: { type: Date },
    hsn: { type: String },
    gstRate: { type: String, default: 'None' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
