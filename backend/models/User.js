const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String,  unique: true,  required: true,  match: /.+\@.+\..+/    },
    phone_number: {  type: String,  unique: true     },
    name: {  type: String,  default: 'No Name' },
    avatar_image: { type: String,  default: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/426586991_1093793288335734_6029067350702747646_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=A9R17kjZOh0Q7kNvgFblgzZ&_nc_ht=scontent.fdad1-2.fna&oh=00_AfAZIxG0-BOV1k8Wkuh8cLhJnFbst8rEniuQF2gtJnp3aQ&oe=663AEEBB'  },
    reward_points: {  type: Number,  default: 10000  },
    otp_verified: {   type: Boolean    },
    password: {   type: String,   required: true,   minlength: 6   },
    role: {  type: String,  enum: ['user', 'moderator', 'admin'],   default: 'user'  },
    account_status: {   type: String,  enum: ['active', 'locked'], default: 'active'  },
    isDeleted: {   type: Boolean,   default: false  } ,
    deletedAt: { type: Date, default: null }

}, { timestamps: true 

});

const User = mongoose.model('User', userSchema);

module.exports = User;
