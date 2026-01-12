const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const Staff = require('./models/Staff');

dotenv.config();

const checkAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const user = await User.findOne({ email: 'sv575014@gmail.com' });
        if (!user) {
            console.log("User not found");
            process.exit();
        }
        console.log("User ID:", user._id);

        const staff = await Staff.find({ user: user._id });
        console.log("Staff Count:", staff.length);
        staff.forEach(s => console.log(`Staff: ${s.name} (${s._id})`));

        const attendance = await Attendance.find({ user: user._id });
        console.log("Attendance Records:", attendance.length);
        attendance.forEach(a => {
            console.log(`Record: Staff=${a.staff}, Date=${a.date}, Status=${a.status}, CreatedAt=${a.createdAt}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAttendance();
