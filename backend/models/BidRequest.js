const mongoose = require('mongoose');

const bidRequestSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bid_price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    seller_response: { type: Boolean, default: null }
}, { timestamps: true });

const BidRequest = mongoose.model('BidRequest', bidRequestSchema);

module.exports = BidRequest;
