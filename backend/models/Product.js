const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    province: String,
    district: String,
    ward: String
});

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String,
    address: AddressSchema
});

module.exports = mongoose.model("Product", ProductSchema);
