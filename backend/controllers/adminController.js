const bcrypt = require('bcrypt');
const User = require('../models/User');
const Product = require('../models/Product');
const { isValidEmail, isValidPassword, isValidPhoneNumber } = require('../middlewares/validator');

//xử lý phê duyệt sản phẩm bằng cách đảo ngược giá trị.
exports.updateApprovedStatus = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
            }
            // Đảo ngược giá trị của admin_approved
            product.admin_approved = !product.admin_approved;

            return product.save();
        })
        .then(updatedProduct => {
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật trạng thái phê duyệt của sản phẩm:', error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};


//lấy tất cả sản phẩm theo trạng thái phê duyệt (true hoặc false)
exports.getProductsByApprovalStatus = (req, res) => {
    // Lấy trạng thái phê duyệt từ query parameters, mặc định là true
    const approved = req.query.approved === 'true';

    Product.find({ admin_approved: approved })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).json({ message: 'Không có sản phẩm.' });
            }
            res.send(products);
        })
        .catch(error => {
            console.error(`Lỗi khi lấy danh sách sản phẩm có trạng thái phê duyệt là ${approved}:`, error);
            res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
        });
};


// exports.getProductFalse = (req, res) => {
//     Product.find({ admin_approved: false })
//         .then(products => {
//             if (products.length === 0) {
//                 return res.status(404).json({ message: 'Không có sản phẩm.' });
//             }
//             res.send(products);
//         })
//         .catch(error => {
//             console.error('Lỗi khi lấy danh sách sản phẩm chưa được phê duyệt:', error);
//             res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
//         });
// };

// exports.getProductTrue = (req, res) => {
//     Product.find({ admin_approved: true })
//         .then(products => {
//             if (products.length === 0) {
//                 return res.status(404).json({ message: 'Không có sản phẩm.' });
//             }
//             res.send(products);
//         })
//         .catch(error => {
//             console.error('Lỗi khi lấy danh sách sản phẩm chưa được phê duyệt:', error);
//             res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
//         });
// };

//lấy tất cả user cho trang admin
exports.getAllUsers = async (req, res) => {
    try {
        // Lấy tất cả người dùng từ cơ sở dữ liệu
        const users = await User.find({});
        
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
    const userId = req.params.userId;
    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng ID
        const user = await User.findById(userId);

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

// exports.lockUserAccount = async (req, res) => {
//     try {
//         // Kiểm tra vai trò của người dùng (chỉ admin mới được phép khóa tài khoản)
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ error: "You are not authorized to perform this action" });
//         }

//         const userId = req.params.userId;
//         const user = await User.findByIdAndUpdate(userId, { account_status: 'locked' }, { new: true });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         res.send('Account has been locked');
//     } catch (error) {
//         console.error('Error locking account:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// exports.unlockUserAccount = async (req, res) => {
//     try {
//         // Kiểm tra vai trò của người dùng (chỉ admin mới được phép mở khóa tài khoản)
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ error: "You are not authorized to perform this action" });
//         }

//         const userId = req.params.userId;
//         const user = await User.findByIdAndUpdate(userId, { account_status: 'active' }, { new: true });
//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         res.send('Account has been unlocked');
//     } catch (error) {
//         console.error('Error unlocking account:', error);
//         res.status(500).send('Internal server error');
//     }
// };

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
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }
        const existingUser = await User.findById(userId);
            // Kiểm tra xem người dùng có tồn tại không
            if (!existingUser) {
                return res.status(404).json({ error: "User not found" });
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

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Xóa người dùng từ cơ sở dữ liệu dựa trên ID
        const deletedUser = await User.findByIdAndDelete(userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông báo xác nhận xóa thành công
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
