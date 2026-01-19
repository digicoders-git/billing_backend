const mongoose = require('mongoose');

const itemCategorySchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true,
        trim: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ItemCategory', itemCategorySchema);
