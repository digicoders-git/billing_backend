const mongoose = require('mongoose');

const godownSchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'Secondary' }, 
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    capacity: { type: Number },
    manager: { type: String },
    isDefault: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Godown', godownSchema);
