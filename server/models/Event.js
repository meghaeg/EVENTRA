const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true },
        district: { type: String, required: false }
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    organizer: { type: String, required: true },
    image: { type: String, required: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Event', EventSchema);
