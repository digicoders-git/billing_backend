const Payment = require('../models/Payment');

const getPayments = async (req, res) => {
    try {
        const query = {};
        if (req.query.type) {
            query.type = req.query.type;
        }
        const payments = await Payment.find(query)
            .populate('party', 'name')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPayment = async (req, res) => {
    try {
        const paymentData = {
            ...req.body,
            user: req.user._id
        };
        const payment = new Payment(paymentData);
        const createdPayment = await payment.save();

        // Update Party Balance (Optional but recommended)
        // If Payment Out, decrease what we owe (To Pay) or increase what we have extra
        // If Payment In, decrease what they owe (To Collect) or increase what they have extra
        
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePayment = async (req, res) => {
    try {
        const result = await Payment.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: 'Payment removed' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPaymentStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Today's Stats
        const todayStats = await Payment.aggregate([
            { $match: { date: { $gte: today } } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);

        // Monthly Stats
        const monthlyStats = await Payment.aggregate([
            { $match: { date: { $gte: thirtyDaysAgo } } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);

        const getVal = (arr, type) => arr.find(s => s._id === type)?.total || 0;

        const Party = require('../models/Party');
        const toCollect = await Party.find({ balanceType: 'To Collect' });
        const toPay = await Party.find({ balanceType: 'To Pay' });

        res.json({
            todayIn: getVal(todayStats, 'Payment In'),
            todayOut: getVal(todayStats, 'Payment Out'),
            monthlyIn: getVal(monthlyStats, 'Payment In'),
            monthlyOut: getVal(monthlyStats, 'Payment Out'),
            totalReceivable: toCollect.reduce((sum, p) => sum + (p.openingBalance || 0), 0),
            totalPayable: toPay.reduce((sum, p) => sum + (p.openingBalance || 0), 0),
            overdueCount: toCollect.length + toPay.length 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNextReceiptNumber = async (req, res) => {
    try {
        const type = req.query.type || 'Payment In';
        const lastPayment = await Payment.findOne({ type }).sort({ createdAt: -1 });
        let nextNo = 1;
        if (lastPayment && lastPayment.receiptNo) {
            const num = parseInt(lastPayment.receiptNo.replace(/\D/g, '')); // Extract number
            if (!isNaN(num)) {
                nextNo = num + 1;
            }
        }
        
        // Format based on type
        const prefix = type === 'Payment Out' ? 'PO' : 'PI';
        const year = new Date().getFullYear();
        const formattedNo = `${prefix}${year}${nextNo.toString().padStart(4, '0')}`;
        
        res.json({ nextNo: formattedNo, rawNo: nextNo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('party');
        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const { date, party, partyName, amount, paymentMode, notes, type, receiptNo } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (payment) {
            payment.date = date || payment.date;
            payment.party = party || payment.party;
            payment.partyName = partyName || payment.partyName;
            payment.amount = amount || payment.amount;
            payment.paymentMode = paymentMode || payment.paymentMode;
            payment.notes = notes || payment.notes;
            payment.type = type || payment.type;
            payment.receiptNo = receiptNo || payment.receiptNo;

            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { 
    getPayments, 
    createPayment, 
    deletePayment, 
    getPaymentStats, 
    getNextReceiptNumber,
    getPaymentById,
    updatePayment
};
