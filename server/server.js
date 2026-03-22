require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const client = require('prom-client');

const app = express();
const path = require('path');

// ---------------------- MIDDLEWARE ----------------------
app.use(express.json({ extended: false }));
app.use(cors());

// ---------------------- PROMETHEUS SETUP ----------------------

// Collect default system metrics
client.collectDefaultMetrics();

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

// Middleware to track requests
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.originalUrl,
            status_code: res.statusCode,
        });
    });
    next();
});

// ---------------------- METRICS ENDPOINT ----------------------
// ✅ Put EARLY to avoid override
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});

// ---------------------- DATABASE ----------------------
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');

    try {
        let admin = await User.findOne({ email: 'admin' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            await User.create({
                name: 'Admin User',
                email: 'admin',
                password: hashedPassword,
                role: 'admin'
            });

            console.log('Admin seeded successfully!');
        }
    } catch (err) {
        console.error('Error seeding admin', err);
    }
}).catch(err => console.error(err));

// ---------------------- ROUTES ----------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

// ---------------------- STATIC FILES ----------------------
// ✅ Move AFTER API + metrics
app.use(express.static(path.join(__dirname, '../client/dist')));

// ---------------------- FRONTEND (React) ----------------------
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ---------------------- SERVER ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});