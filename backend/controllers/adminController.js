const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const { isValidEmail, isValidPassword, isValidPhoneNumber } = require('../middlewares/validator');
const cache = require("memory-cache");

//xử lý phê duyệt sản phẩm bằng cách đảo ngược giá trị.
exports.updateApprovedStatus = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
            }
            // Đảo ngược giá trị của admin_approved
            product.admin_approved = !product.admin_approved;
            return product.save();
        })
        .then(updatedProduct => {
            cache.clear();
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật trạng thái phê duyệt của sản phẩm:', error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};

exports.rejectProduct = (req, res) => {
    const productId = req.params.productId;
    const { rejectedReason } = req.body; // Lý do từ chối từ request body

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
            }

            // Cập nhật trạng thái từ chối và lưu lý do
            product.admin_approved = false;
            product.admin_rejected = true;
            product.admin_rejected_reason = rejectedReason;

            return product.save();
        })
        .then(updatedProduct => {
            cache.clear();
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Lỗi khi từ chối sản phẩm:', error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};
// Lấy tất cả sản phẩm bị từ chối
exports.getRejectedProducts = (req, res) => {
    Product.find({ admin_rejected: true })
        .populate({
            path: 'author',
            match: { isDeleted: false }
        })
        .then(products => {
            const filteredProducts = products.filter(product => product.author !== null);
            // Thay vì trả về 404, trả về 200 với mảng rỗng
            if (filteredProducts.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).send(filteredProducts);
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách sản phẩm bị từ chối:', error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};

//lấy tất cả sản phẩm theo trạng thái phê duyệt (true hoặc false)
exports.getProductsByApprovalStatus = (req, res) => {
    const approved = req.query.approved === 'true';

    Product.find({ admin_approved: approved, admin_rejected: false })
        .populate({
            path: 'author',
            match: { isDeleted: false }
        })
        .then(products => {
            const filteredProducts = products.filter(product => product.author !== null);
            // Instead of returning a 404, return a 200 with an empty array
            if (filteredProducts.length === 0) {
                return res.status(200).json([]);
            }
            res.status(200).send(filteredProducts);
        })
        .catch(error => {
            console.error(`Lỗi khi lấy danh sách sản phẩm có trạng thái phê duyệt là ${approved}:`, error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};


//lấy tất cả user cho trang admin
exports.getAllUsers = async (req, res) => {
    try {

        if (req.user.role !== 'admin') {
            return res.status(409).json({ error: "You are not authorized to perform this action" });
        }

        // Lấy tất cả người dùng từ cơ sở dữ liệu
        // const users = await User.find({}); // Lấy tất cả người dùng
        const users = await User.find({ role: 'user', isDeleted: false });
        // Kiểm tra xem có người dùng nào không
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        // Trả về danh sách người dùng
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//xử lý lấy thông tin user theo id cho trang detail user của admin
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }
        // Tìm người dùng trong cơ sở dữ liệu bằng ID
        // const user = await User.findById(userId);
        const user = await User.findOne({ _id: userId, isDeleted: false });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông tin chi tiết của người dùng
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//khóa và mở khóa account user, đảo ngược giá trị.
exports.changeStatusAccount = async (req, res) => {
    try {
        // Kiểm tra vai trò của người dùng (chỉ admin mới được phép thực hiện hành động này)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Bạn không được phép thực hiện hành động này." });
        }

        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        // Đảo ngược trạng thái tài khoản
        user.account_status = user.account_status === 'active' ? 'locked' : 'active';

        await user.save();
        cache.clear();

        // Trả về thông báo phản hồi
        const action = user.account_status === 'active' ? 'unlocked' : 'locked';
        res.json({ message: `Tài khoản đã được ${action}.` });
        
    } catch (error) {
        console.error('Lỗi khi thực hiện hành động:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
    }
};
//edit thông tin user chỉ dành cho admin 
exports.updateUserByIdForAdmin = async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    try {
      //  Kiểm tra vai trò của người dùng (chỉ admin mới được phép cập nhật thông tin này)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action, ADMIN mới được nhé by SONDZ" });
        }
        const existingUser = await User.findById(userId);
            // Kiểm tra xem người dùng có tồn tại không
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
            }
        
            const emailExists = await User.findOne({ email: updateData.email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ error: "Email already exists" });
            }
    
            // Kiểm tra xem số điện thoại đã tồn tại trong cơ sở dữ liệu hay chưa
            const phoneExists = await User.findOne({ phone_number: updateData.phone_number });
            if (phoneExists && phoneExists._id.toString() !== userId) {
                return res.status(400).json({ error: "Phone number already exists" });
            }
            
        if (!updateData.email) {
            // Sử dụng giá trị hiện tại của trường email trong cơ sở dữ liệu
            updateData.email = existingUser.email;
        } else {
            // Kiểm tra định dạng email
            if (!isValidEmail(updateData.email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
        }
      
        if (!updateData.phone_number) {
            updateData.phone_number = existingUser.phone_number;
        } else {
            // Kiểm tra định dạng số điện thoại
            if (!isValidPhoneNumber(updateData.phone_number)) {
                return res.status(400).json({ error: "Invalid phone number format" });
            }
        }

        if (!updateData.password) {
            updateData.password = existingUser.password;
        } else {
            // Kiểm tra định dạng password
            if (!isValidPassword(updateData.password)) {
                return res.status(400).json({ error: "Password must be at least 10 characters long" });
            }
            // Mã hóa mật khẩu mới trước khi cập nhật
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        // Cập nhật người dùng trong cơ sở dữ liệu dựa trên ID
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
            cache.clear();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }
        const userId = req.params.userId;

        // Cập nhật người dùng thành trạng thái đã xóa
        const deletedUser = await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() }, { new: true });

        // Kiểm tra xem người dùng có tồn tại không
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        cache.clear();
        // Trả về thông báo xác nhận xóa thành công
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
