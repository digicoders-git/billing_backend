const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Purchase = require('./models/Purchase');
const User = require('./models/User');
const Party = require('./models/Party');

dotenv.config();

const testSettle = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({});
        const party = await Party.findOne({ type: 'Supplier' }) || await Party.create({ name: 'Test Supplier', type: 'Supplier', balanceType: 'To Pay', openingBalance: 500 });
        
        await Purchase.create({
            invoiceNo: 'TEST-' + Date.now(),
            date: new Date(),
            party: party._id,
            user: user._id,
            items: [{ name: 'Test Item', qty: 1, rate: 100, amount: 100 }],
            totalAmount: 100,
            balanceAmount: 100
        });
        
        console.log('Purchase created');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testSettle();
