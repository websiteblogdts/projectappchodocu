const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
