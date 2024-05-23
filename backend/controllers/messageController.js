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


exports.getMessages = async ( req, res) => {
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

// exports.getUsersWhoMessaged = async (req, res) => {
//     const userId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

//     try {
//         // Tìm tất cả cuộc trò chuyện mà người dùng tham gia và có ít nhất một tin nhắn
//         const allChats = await Chat.find({ participants: userId, lastMessage: { $exists: true } })
//             .populate('lastMessage', 'content')
//             .sort({ 'updatedAt': -1 }); // Sắp xếp theo thời gian cập nhật giảm dần

//         if (!allChats) {
//             return res.status(404).json({ message: 'No chats found' });
//         }

//         // Tạo một object để lưu danh sách người dùng, được sắp xếp theo thời gian cập nhật
//         const usersByProduct = {};

//         // Duyệt qua mỗi cuộc trò chuyện
//         for (const chat of allChats) {
//             // Lấy thông tin của sản phẩm từ cuộc trò chuyện
//             const productId = chat.product;

//             // Kiểm tra xem sản phẩm đã được thêm vào danh sách chưa
//             if (!usersByProduct[productId]) {
//                 // Lấy thông tin chi tiết của sản phẩm từ cơ sở dữ liệu
//                 const product = await Product.findById(productId);
//                 if (product) {
//                     // Thêm thông tin sản phẩm vào đối tượng người dùng
//                     usersByProduct[productId] = {
//                         _id: product._id,
//                         name: req.user.name, // Lấy tên người dùng từ req.user
//                         product_image: product.images[0], // Sử dụng hình ảnh đầu tiên của sản phẩm
//                         chatId: chat._id,
//                         lastMessage: chat.lastMessage ? chat.lastMessage : null,
//                         productName: product.name,
//                     };
//                 }
//             }
//         }

//         // Chuyển đổi object thành mảng và trả về
//         const users = Object.values(usersByProduct);
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.getUsersWhoMessaged = async (req, res) => {
    const userId = req.user.id; // Lấy userId từ thông tin người dùng đã xác thực

    try {
        // Tìm tất cả tin nhắn mà người dùng là người gửi và có ít nhất một tin nhắn
        const allMessages = await Message.find({ sender: userId })
            .populate({
                path: 'chat',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            })
            .sort({ 'updatedAt': -1 }); // Sắp xếp theo thời gian cập nhật giảm dần

        if (!allMessages) {
            return res.status(404).json({ message: 'No chats found' });
        }

        // Tạo một object để lưu danh sách người dùng, được sắp xếp theo thời gian cập nhật
        const usersByProduct = {};

        // Duyệt qua mỗi tin nhắn
        for (const message of allMessages) {
            const chat = message.chat;
            const productId = chat.product._id;

            // Kiểm tra xem sản phẩm đã được thêm vào danh sách chưa
            if (!usersByProduct[productId]) {
                // Thêm thông tin sản phẩm vào đối tượng người dùng
                usersByProduct[productId] = {
                    _id: chat.product._id,
                    name: req.user.name, // Lấy tên người dùng từ req.user
                    product_image: chat.product.images[0], // Sử dụng hình ảnh đầu tiên của sản phẩm
                    chatId: chat._id,
                    lastMessage: message.content ? message.content : null,
                    productName: chat.product.name,
                    read: message.read // Sử dụng trường read từ tin nhắn
                };
            }
        }

        // Chuyển đổi object thành mảng và trả về
        const users = Object.values(usersByProduct);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markMessagesAsRead = async (req, res) => {
    try {
        // Lấy chatId từ yêu cầu
        const { chatId } = req.body;

        // Cập nhật tất cả các tin nhắn trong cuộc trò chuyện có chatId tương ứng
        await Message.updateMany({ chat: chatId }, { read: true });

        res.status(200).json({ message: 'Marked messages as read successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
