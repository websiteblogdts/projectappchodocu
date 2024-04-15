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


// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     description: { type: String },
//     image: { type: String },
//     address: { type: String },
//     category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//     admin_approved: { type: Boolean, default: false }
// }, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;

