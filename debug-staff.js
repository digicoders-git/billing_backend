const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Staff = require('./models/Staff');

dotenv.config();

const debugStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const allStaff = await Staff.find({});
        console.log("Total Staff in DB:", allStaff.length);
        
        console.log("--- STAFF LIST ---");
        allStaff.forEach(s => {
            console.log(`Name: ${s.name}, ID: ${s._id}, UserID: ${s.user}`);
        });

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log("\n--- USERS LIST ---");
        users.forEach(u => {
            console.log(`Name: ${u.name}, ID: ${u._id}, Email: ${u.email}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugStaff();
