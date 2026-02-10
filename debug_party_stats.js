const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Party = require('./models/Party');
const Purchase = require('./models/Purchase');
const Invoice = require('./models/Invoice');

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const parties = await Party.aggregate([
            {
                $group: {
                    _id: null,
                    totalToCollect: {
                        $sum: {
                            $cond: [
                                { $regexMatch: { input: { $toLower: { $ifNull: ["$balanceType", ""] } }, pattern: "collect" } },
                                { $toDouble: { $ifNull: ["$openingBalance", 0] } },
                                0
                            ]
                        }
                    },
                    totalToPay: {
                        $sum: {
                            $cond: [
                                { $regexMatch: { input: { $toLower: { $ifNull: ["$balanceType", ""] } }, pattern: "pay" } },
                                { $toDouble: { $ifNull: ["$openingBalance", 0] } },
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        console.log('Party Aggregate Results:', JSON.stringify(parties, null, 2));

        const allParties = await Party.find({});
        let jsToPay = 0;
        allParties.forEach(p => {
            const type = (p.balanceType || '').toLowerCase();
            if (type.includes('pay')) jsToPay += (Number(p.openingBalance) || 0);
        });
        console.log('JS Calculation toPay:', jsToPay);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
