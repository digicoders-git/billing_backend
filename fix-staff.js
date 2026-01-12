const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Staff = require('./models/Staff');
const User = require('./models/User');

dotenv.config();

const fixOrphanedStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Find the specific user
        const targetUser = await User.findOne({ email: 'sv575014@gmail.com' });
        if (!targetUser) {
            console.log("User not found!");
            process.exit(1);
        }
        console.log(`Found User: ${targetUser.name} (${targetUser._id})`);

        // Find staff with no user assigned
        const orphanedStaff = await Staff.find({ user: { $exists: false } }); // or $eq: null
        // Note: Sometimes mongoose returns undefined as null in queries, but let's be safe.
        // Let's try to update all of them that don't have a user.
        
        const result = await Staff.updateMany(
            { user: { $exists: false } },
            { $set: { user: targetUser._id } }
        );

        // Also catch those that might be explicitly null
        const result2 = await Staff.updateMany(
            { user: null },
            { $set: { user: targetUser._id } }
        );

        console.log(`Updated ${result.modifiedCount + result2.modifiedCount} staff records.`);
        console.log("All staff should now be visible.");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixOrphanedStaff();
