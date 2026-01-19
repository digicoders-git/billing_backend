const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                branch: 'Main'
            });
            console.log('Admin user created successfully: admin / admin');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedAdmin();
