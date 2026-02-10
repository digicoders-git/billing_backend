const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');
const Payment = require('../models/Payment');
const Account = require('../models/Account');
const Party = require('../models/Party');


// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Public
const getDashboardStats = async (req, res) => {
    try {
        // Fetch all data in parallel for speed
        const [allParties, allInvoices, allPurchases, allAccounts, recentPayments] = await Promise.all([
            Party.find({}),
            Invoice.find({}),
            Purchase.find({}),
            Account.find({}),
            Payment.find({}).sort({ createdAt: -1 }).limit(10).populate('party', 'name')
        ]);

        // 1. Calculate Parties Opening Balances
        let partyToCollect = 0;
        let partyToPay = 0;

        allParties.forEach(party => {
            const balance = Number(party.openingBalance) || 0;
            const type = (party.balanceType || '').toLowerCase();
            
            if (type.includes('collect')) {
                partyToCollect += balance;
            } else if (type.includes('pay')) {
                partyToPay += balance;
            }
        });
        
        // 2. Calculate Invoices (Sales) Pending Balance
        const invoiceToCollect = allInvoices.reduce((sum, inv) => sum + (Number(inv.balanceAmount) || 0), 0);

        // 3. Calculate Purchases Pending Balance
        const purchaseToPay = allPurchases.reduce((sum, pur) => sum + (Number(pur.balanceAmount) || 0), 0);

        // Grand Totals
        const toCollect = partyToCollect + invoiceToCollect;
        const toPay = partyToPay + purchaseToPay;

        // 4. Cash + Bank Balance
        const currentBalance = allAccounts.reduce((sum, acc) => sum + (Number(acc.openingBalance) || 0), 0);

        // 5. Build Recent Transactions List
        const recentInv = allInvoices
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const recentPur = allPurchases
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const combined = [
            ...recentInv.map(inv => ({
                _id: inv._id,
                id: inv.invoiceNo,
                customer: inv.party ? inv.party.name : inv.partyName,
                type: 'Sales Invoice',
                amount: `₹ ${(Number(inv.totalAmount) || 0).toLocaleString('en-IN')}`,
                date: new Date(inv.date),
                displayDate: new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            })),
            ...recentPur.map(pur => ({
                _id: pur._id,
                id: pur.billNo || pur.invoiceNo || pur._id,
                customer: pur.party ? pur.party.name : pur.partyName,
                type: 'Purchase',
                amount: `₹ ${(Number(pur.totalAmount) || 0).toLocaleString('en-IN')}`,
                date: new Date(pur.date),
                displayDate: new Date(pur.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            })),
            ...recentPayments.map(pay => ({
                _id: pay._id,
                id: pay.receiptNo,
                customer: pay.party ? pay.party.name : pay.partyName,
                type: pay.type,
                amount: `₹ ${(Number(pay.amount) || 0).toLocaleString('en-IN')}`,
                date: new Date(pay.date),
                displayDate: new Date(pay.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            }))
        ];

        const formattedTransactions = combined
            .sort((a, b) => b.date - a.date)
            .slice(0, 10)
            .map(t => ({
                ...t,
                date: t.displayDate
            }));

        // 6. Revenue Chart (Sales)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyRevenue = await Invoice.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $month: "$date" }, totalRevenue: { $sum: "$totalAmount" } } },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const incomeChart = {
            categories: monthlyRevenue.map(item => monthNames[item._id - 1]),
            data: monthlyRevenue.map(item => item.totalRevenue)
        };

        // 7. Status Distribution
        const statusDistribution = await Invoice.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const invoiceStatus = { paid: 0, pending: 0, overdue: 0 };
        statusDistribution.forEach(stat => {
            if (stat._id === 'Paid') invoiceStatus.paid += stat.count;
            else if (stat._id === 'Unpaid' || stat._id === 'Partial') invoiceStatus.pending += stat.count;
            else if (stat._id === 'Overdue') invoiceStatus.overdue += stat.count;
        });

        res.json({
            toCollect: parseFloat(toCollect.toFixed(2)),
            toPay: parseFloat(toPay.toFixed(2)),
            currentBalance: parseFloat(currentBalance.toFixed(2)),
            recentTransactions: formattedTransactions,
            incomeChart,
            invoiceStatus
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getDashboardStats
};
