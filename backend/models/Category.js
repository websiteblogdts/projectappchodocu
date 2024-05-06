const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    isDeleted: {   type: Boolean,   default: false  } ,
    deletedAt: { type: Date }
});

CategorySchema.add({ isDeleted: { type: Boolean, default: false } });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
