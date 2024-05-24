const { Chat, Message } = require('../models/Message'); // Ensure the path is correct
const Product = require('../models/Product');
const User = require('../models/User');
const io = require('../config/socket');



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
              // Gửi sự kiện 'newChat' đến tất cả máy khách
              io.emit('newChat', chat);
            //   console.log('Received new message from Postman:', chat);

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

        // Lấy thông tin người gửi từ cơ sở dữ liệu và đính kèm vào tin nhắn mới
        const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar_image');

        // Gửi tin nhắn mới cùng với thông tin người gửi
        io.emit('newMessage', populatedMessage);

        // Cập nhật tin nhắn cuối cùng trong cuộc trò chuyện
        chat.lastMessage = content;
        await chat.save();

        // Lấy tất cả tin nhắn trong cuộc trò chuyện và trả về chúng
        const messages = await Message.find({ chat: chatId }).populate('sender', 'username');

        console.log('Received data from client:', { chatId, senderId, content });
        // console.log('Received new message from Postman:', message);
      
        // Phản hồi với tin nhắn đã được gửi
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
      const chat = await Chat.findById(chatId).populate('product', 'name price images');
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
  
      // Lấy tất cả tin nhắn trong cuộc trò chuyện và trả về chúng, bao gồm cả tên sản phẩm
      const messages = await Message.find({ chat: chatId }).populate('sender', 'name avatar_image');
      res.status(200).json({
        messages,
        currentUserId,
        productName: chat.product.name,
        productPrice: chat.product.price,
        productImage: chat.product.images[0] // Add this line to include the product image
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

exports.getUsersWhoMessaged = async (req, res) => {
    const userId = req.user.id;

    try {
        const allChats = await Chat.find({ participants: userId, lastMessage: { $exists: true } })
            .populate('product', 'name price images')
            .sort({ 'updatedAt': -1 });

        if (!allChats) {
            return res.status(404).json({ message: 'No chats found' });
        }

        const usersByProduct = {};

        for (const chat of allChats) {
            const unreadCount = await Message.countDocuments({ chat: chat._id, sender: { $ne: userId }, read: false });
            const productId = chat.product._id;

            if (!usersByProduct[productId]) {
                const lastMessage = await Message.findOne({ chat: chat._id }).sort({ 'createdAt': -1 }).populate('sender', 'name');

                if (lastMessage) {
                    usersByProduct[productId] = {
                        _id: chat.product._id,
                        name: lastMessage.sender.name,
                        product_image: chat.product.images[0],
                        chatId: chat._id,
                        lastMessage: lastMessage.content,
                        productName: chat.product.name,
                        unreadCount: unreadCount,
                        read: lastMessage.read,
                        senderId: lastMessage.sender._id
                    };
                }
            }
        }

        const users = Object.values(usersByProduct);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markMessagesAsRead = async (req, res) => {
    try {
        // Lấy thông tin người dùng hiện tại từ req.user
        const currentUser = req.user;
        const currentUserId = currentUser.id; // Lấy id của người dùng hiện tại

        // Lấy chatId từ yêu cầu
        const { chatId } = req.body;

        // Cập nhật trường real sang true cho các tin nhắn không phải của người dùng hiện tại
        await Message.updateMany(
            { chat: chatId, sender: { $ne: currentUserId }, real: false }, // Điều kiện lọc tin nhắn không phải của người dùng hiện tại và real là false
            { $set: { real: true } }
        );

        // Đánh dấu là đã đọc tất cả các tin nhắn của người khác trong cuộc trò chuyện
        await Message.updateMany(
            { chat: chatId, sender: { $ne: currentUserId } },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'Marked messages as read successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

