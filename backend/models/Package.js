// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: Number }, // Duration in days for VIP package
    points: { type: Number },   // Points for loyalty package
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
