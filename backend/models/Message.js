const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
