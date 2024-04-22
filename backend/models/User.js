const mongoose = require('mongoose');

const userSchema = new mongoose.Schema
(
    {
        email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ },
        phone_number: { type: String, unique: true },
        name: { type: String, default: 'No Name' },
        avatar_image: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/019/494/983/original/muscle-man-boy-avatar-user-person-people-cartoon-cute-colored-outline-sticker-retro-style-vector.jpg'  },
        reward_points: { type: Number, default: '10000'},
        otp_verified: { type: Boolean },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
        account_status: { type: String, enum: ['active', 'locked'], default: 'active' }}, 
        { timestamps: true 
    }
); 

const User = mongoose.model('User', userSchema);

module.exports = User;
