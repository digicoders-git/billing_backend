const mongoose = require('mongoose');

const staffSchema = mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    salaryType: { type: String, enum: ['Monthly', 'Daily', 'Weekly'], default: 'Monthly' },
    salary: { type: Number, required: true },
    salaryCycle: { type: String }, // e.g., "10 to 10"
    openingBalance: { type: Number, default: 0 },
    balanceType: { type: String, enum: ['To Pay', 'To Collect'], default: 'To Pay' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner reference
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
