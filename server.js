const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://billing-frontend-woad.vercel.app',
        'https://www.fishmedica.in',
        process.env.FRONTEND_URL || '*'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/parties', require('./routes/partyRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/purchase-orders', require('./routes/purchaseOrderRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/godowns', require('./routes/godownRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/expense-categories', require('./routes/expenseCategoryRoutes'));
app.use('/api/party-categories', require('./routes/partyCategoryRoutes'));
app.use('/api/item-categories', require('./routes/itemCategoryRoutes'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
