const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    province: String,
    district: String,
    ward: String
});

const ProductSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    price: Number,
    description: String,
    image: String,
    // category: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Tham chiếu tới Category
    address: AddressSchema,
    admin_approved: { type: Boolean, default: true }
}, { timestamps: true

});

module.exports = mongoose.model("Product", ProductSchema);

