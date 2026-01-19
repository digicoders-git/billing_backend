const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Branch = require('./models/Branch');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name username email role');
        console.log('Users in DB:', JSON.stringify(users, null, 2));

        const branches = await Branch.find({}, 'name username contact');
        console.log('Branches in DB:', JSON.stringify(branches, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
