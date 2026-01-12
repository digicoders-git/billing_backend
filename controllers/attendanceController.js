const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');

// Helper to get start/end of day in local time or consistent UTC
const getDayRange = (dateStr) => {
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// Mark or Update Attendance
const markAttendance = async (req, res) => {
    console.log("Marking Attendance Request Body:", req.body);
    try {
        const { staffId, date, status, inTime, outTime, note } = req.body;

        const d = new Date(date);
        // Set to UTC midnight to avoid timezone issues
        d.setUTCHours(0, 0, 0, 0);
        console.log("Processed Date (UTC):", d.toISOString());

        // Check if staff belongs to user
        const staff = await Staff.findOne({ _id: staffId, user: req.user._id });
        if (!staff) {
            console.log("Staff not found for user:", req.user._id, "StaffId:", staffId);
            return res.status(404).json({ message: 'Staff not found' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { staff: staffId, date: d },
            { 
                user: req.user._id,
                status, 
                inTime, 
                outTime, 
                note 
            },
            { new: true, upsert: true }
        );
        console.log("Attendance Saved/Updated:", attendance);

        res.status(200).json(attendance);
    } catch (error) {
        console.error("Mark Attendance Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Attendance for a specific Staff (Month-wise or Range)
const getStaffAttendance = async (req, res) => {
    try {
        const { staffId } = req.params;
        const { month, year } = req.query;

        let query = { staff: staffId, user: req.user._id };

        if (month && year) {
             // Construct range for the whole month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0); 
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Attendance overview for all staff on a specific date (e.g., Today)
const getDailyAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDateStr = date || new Date().toISOString().split('T')[0];
        
        // Create range for that specific date (UTC)
        const start = new Date(targetDateStr);
        start.setUTCHours(0,0,0,0);
        
        const end = new Date(targetDateStr);
        end.setUTCHours(23,59,59,999);

        // Find all staff first
        const staffList = await Staff.find({ user: req.user._id });

        // Find attendance for that day range
        const attendanceRecords = await Attendance.find({ 
            user: req.user._id, 
            date: { $gte: start, $lte: end }
        });

        // Map staff with their attendance status
        const report = staffList.map(staff => {
            const record = attendanceRecords.find(a => a.staff.toString() === staff._id.toString());
            return {
                ...staff.toObject(),
                attendance: record || null
            };
        });

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getStaffAttendance,
    getDailyAttendance
};
