const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Half Day', 'On Leave', 'Holiday'], 
        default: 'Present' 
    },
    inTime: { type: String }, // e.g., "09:00 AM"
    outTime: { type: String }, // e.g., "06:00 PM"
    note: { type: String }
}, {
    timestamps: true
});

// Ensure one attendance record per staff per day
attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
