const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

// Middleware to check if admin
const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            const user = await User.findById(req.user.id);
            if (user.role !== 'admin') {
                return res.status(403).json({ msg: 'Access denied, admin only' });
            }
        }
        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @route   GET api/admin/events
// @desc    Get all events
router.get('/events', auth, isAdmin, async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/events/:id
// @desc    Update event status
router.put('/events/:id', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        event.status = status;
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
