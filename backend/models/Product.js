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
    images: { type: [String], required: true}, // Sử dụng mảng các chuỗi để lưu trữ nhiều URL hình ảnh
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Tham chiếu tới Category
    address: AddressSchema,
    admin_approved: { type: Boolean, default: false },
    
    admin_rejected: { type: Boolean, default: false },
    admin_rejected_reason: { type: String },
    resubmitted: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true

});

module.exports = mongoose.model("Product", ProductSchema);

