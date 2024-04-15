const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
}, {
    collection: "admins"
});

module.exports = mongoose.model("Admin", AdminSchema);

// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     role: { type: String }
// });

// const Admin = mongoose.model('Admin', adminSchema);

// module.exports = Admin;
