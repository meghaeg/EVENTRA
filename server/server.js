require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');
    // Seed admin
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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
