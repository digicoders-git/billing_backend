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

        const allParties = await Party.find({});
        console.log(`Total Parties: ${allParties.length}`);
        
        let partyToCollect = 0;
        let partyToPay = 0;

        allParties.forEach(party => {
            const balance = party.openingBalance || 0;
            const type = (party.balanceType || '').toLowerCase();
            console.log(`Party: ${party.name}, Balance: ${balance}, Type: ${party.balanceType}`);
            
            if (type.includes('collect')) {
                partyToCollect += balance;
            } else if (type.includes('pay')) {
                partyToPay += balance;
            }
        });

        const allPurchases = await Purchase.find({});
        console.log(`Total Purchases: ${allPurchases.length}`);
        const purchaseToPay = allPurchases.reduce((sum, pur) => sum + (pur.balanceAmount || 0), 0);
        
        const allInvoices = await Invoice.find({});
        console.log(`Total Invoices: ${allInvoices.length}`);
        const invoiceToCollect = allInvoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);

        console.log('--- Results ---');
        console.log(`partyToCollect: ${partyToCollect}`);
        console.log(`partyToPay: ${partyToPay}`);
        console.log(`invoiceToCollect: ${invoiceToCollect}`);
        console.log(`purchaseToPay: ${purchaseToPay}`);
        console.log(`Total To Collect: ${partyToCollect + invoiceToCollect}`);
        console.log(`Total To Pay: ${partyToPay + purchaseToPay}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
