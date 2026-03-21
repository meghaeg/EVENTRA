const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  interests: [{ type: String }],
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
