const { Chat, Message } = require('../models/Message'); // Ensure the path is correct
const Product = require('../models/Product');
const User = require('../models/User');


exports.getRoutes = (req, res) => {
    res.send('Hello son');
};


exports.newChat = async (req, res) => { // Added async here
    const { userId, productId } = req.body;

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [userId, product.author] },
            product: productId
        });

        if (!chat) {
            // Create a new chat if it doesn't exist
            chat = new Chat({
                participants: [userId, product.author],
                product: productId,
                lastMessage: ''
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.sendMess = async (req, res) => {
    const { chatId, senderId, content } = req.body;

    try {
        // Tìm chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' });
        }

        // Xác định vai trò của người gửi tin nhắn
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: 'Người gửi không tồn tại' });
        }

        // Tạo tin nhắn mới
        const message = new Message({
            chat: chatId,
            sender: senderId,
            content: content,
        });
        await message.save();

        // Cập nhật tin nhắn cuối cùng trong cuộc trò chuyện
        chat.lastMessage = content;
        await chat.save();

        // Lấy tất cả tin nhắn trong cuộc trò chuyện và trả về chúng
        const messages = await Message.find({ chat: chatId }).populate('sender', 'username');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// exports.getMessages = async (req, res) => {
//     const { chatId } = req.params;

//     try {
//         const messages = await Message.find({ chat: chatId })
//         .populate('sender', 'name avatar_image');
//         if (!messages) {
//             return res.status(404).json({ message: 'No messages found' });
//         }

//         res.status(200).json(messages);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    const currentUserId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

    try {
        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'name avatar_image'); // Lấy thêm thông tin về name và avatar_image của người gửi
        if (!messages) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.status(200).json({ messages, currentUserId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsersWhoMessaged = async (req, res) => {
    const userId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực


    try {
        const chatsMess = await Chat.find({ participants: userId })
            .populate('participants', 'name avatar_image')
            // .populate('product', 'name');
            .populate('lastMessage', 'content'); // Populate lastMessage content


        if (!chatsMess) {
            return res.status(404).json({ message: 'No chats found' });
        }

        const users = [];
        chatsMess.forEach(chat => {
            chat.participants.forEach(participant => {
                if (participant._id.toString() !== userId && !users.some(user => user._id.toString() === participant._id.toString())) {
                    users.push({
                        _id: participant._id,
                        name: participant.name,
                        avatar_image: participant.avatar_image,
                        chatId: chat._id,
                        lastMessage: chat.lastMessage ? chat.lastMessage.content : ''
                    });
                }
            });
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};