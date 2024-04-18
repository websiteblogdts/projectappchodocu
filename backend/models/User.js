const mongoose = require('mongoose');

const userSchema = new mongoose.Schema
(
    {
        email: { type: String, unique: true, required: true },
        phone_number: { type: String, unique: true },
        name: { type: String },
        avatar_image: { type: String },
        reward_points: { type: Number },
        otp_verified: { type: Boolean },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
        account_status: { type: String, enum: ['active', 'locked'], default: 'active' }}, 
        { timestamps: true 
    }
); 

const User = mongoose.model('User', userSchema);

module.exports = User;
