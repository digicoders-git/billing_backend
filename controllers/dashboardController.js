const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');
const Payment = require('../models/Payment');
const Account = require('../models/Account');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Public
const getDashboardStats = async (req, res) => {
    try {
        // 1. Calculate To Collect (Sum of balanceAmount of all Sales Invoices)
        const invoices = await Invoice.aggregate([
            {
                $group: {
                    _id: null,
                    totalToCollect: { $sum: "$balanceAmount" }
                }
            }
        ]);
        const toCollect = invoices.length > 0 ? invoices[0].totalToCollect : 0;

        // 2. Calculate To Pay (Sum of balanceAmount of all Purchases)
        const purchases = await Purchase.aggregate([
            {
                $group: {
                    _id: null,
                    totalToPay: { $sum: "$balanceAmount" }
                }
            }
        ]);
        const toPay = purchases.length > 0 ? purchases[0].totalToPay : 0;

        // 3. Calculate Cash + Bank Balance (Sum of all Accounts' openingBalance + transactions effect)
        // Ideally we should rely on the Account model directly
        const accounts = await Account.find({});
        const currentBalance = accounts.reduce((sum, acc) => sum + (acc.openingBalance || 0), 0);

        // 4. Recent Transactions (Latest 5 Invoices)
        const recentTransactions = await Invoice.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('party', 'name');

        const formattedTransactions = recentTransactions.map(inv => ({
            id: inv.invoiceNo,
            customer: inv.party ? inv.party.name : inv.partyName,
            type: 'Sales Invoices',
            amount: `₹ ${inv.totalAmount.toLocaleString()}`,
            date: new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }));

        // 5. Revenue Chart Data (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Invoice.aggregate([
            {
                $match: {
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalRevenue: { $sum: "$totalAmount" },
                    year: { $first: { $year: "$date" } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const incomeChart = {
            categories: monthlyRevenue.map(item => monthNames[item._id - 1]),
            data: monthlyRevenue.map(item => item.totalRevenue)
        };

        // 6. Invoice Status Distribution
        const statusDistribution = await Invoice.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const invoiceStatus = {
            paid: 0,
            pending: 0,
            overdue: 0
        };

        statusDistribution.forEach(stat => {
            if (stat._id === 'Paid') invoiceStatus.paid += stat.count;
            else if (stat._id === 'Unpaid' || stat._id === 'Partial') invoiceStatus.pending += stat.count;
            else if (stat._id === 'Overdue') invoiceStatus.overdue += stat.count;
        });

        res.json({
            toCollect,
            toPay,
            currentBalance,
            recentTransactions: formattedTransactions,
            incomeChart,
            invoiceStatus
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
