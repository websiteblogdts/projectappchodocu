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

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    const currentUserId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

    try {
        // Tìm cuộc trò chuyện
        const chat = await Chat.findById(chatId).populate('product', 'name price');
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Lấy tất cả tin nhắn trong cuộc trò chuyện và trả về chúng, bao gồm cả tên sản phẩm
        const messages = await Message.find({ chat: chatId }).populate('sender', 'name avatar_image');
        res.status(200).json({ messages, currentUserId, productName: chat.product.name, productPrice: chat.product.price });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUsersWhoMessaged = async (req, res) => {
    const userId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

    try {
        // Tìm tất cả cuộc trò chuyện mà người dùng tham gia
        const allChats = await Chat.find({ participants: userId })
            .populate('lastMessage', 'content');

        if (!allChats) {
            return res.status(404).json({ message: 'No chats found' });
        }

        // Tạo một object để lưu danh sách người dùng, được sắp xếp theo productId
        const usersByProduct = {};

        // Duyệt qua mỗi cuộc trò chuyện
        for (const chat of allChats) {
            // Lấy thông tin của sản phẩm từ cuộc trò chuyện
            const productId = chat.product;

            // Kiểm tra xem sản phẩm đã được thêm vào danh sách chưa
            if (!usersByProduct[productId]) {
                // Lấy thông tin chi tiết của sản phẩm từ cơ sở dữ liệu
                const product = await Product.findById(productId);
                if (product) {
                    // Thêm thông tin sản phẩm vào đối tượng người dùng
                    usersByProduct[productId] = {
                        _id: product._id,
                        name: req.user.name, // Lấy tên người dùng từ req.user
                        avatar_image: product.images[0], // Sử dụng hình ảnh đầu tiên của sản phẩm
                        chatId: chat._id,
                        lastMessage: chat.lastMessage ? chat.lastMessage : null,
                        productName: product.name
                    };
                }
            }
        }

        // Chuyển đổi object thành mảng và trả về
        const users = Object.values(usersByProduct);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
