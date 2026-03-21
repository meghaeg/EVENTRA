const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @route   GET api/events
// @desc    Get all approved events
router.get('/', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const events = await Event.find({ status: 'approved', date: { $gte: today } }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/:id
// @desc    Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events
// @desc    Create an event
router.post('/', auth, async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.id
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events/register/:id
// @desc    Register for an event
router.post('/register/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        let reg = await Registration.findOne({ userId: req.user.id, eventId: req.params.id });
        if (reg) return res.status(400).json({ msg: 'Already registered for this event' });

        reg = new Registration({
            userId: req.user.id,
            eventId: req.params.id
        });
        await reg.save();
        res.json(reg);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/user/registered
// @desc    Get user's registered events
router.get('/user/registered', auth, async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.user.id }).populate('eventId');
        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/user/created
// @desc    Get user's created events
router.get('/user/created', auth, async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
