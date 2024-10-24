const Product = require('../models/Product');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = "Gcd191140";
const User = require('../models/User');
// const { isValidimages } = require('../middlewares/validator');
const cache = require("memory-cache");

exports.getRoutes = (req, res) => {
    res.send('Hello son');
};

// Hàm xử lý hiển thị đetail product
exports.getProductById = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .populate('author', 'isDeleted account_status')
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Kiểm tra người dùng có bị xóa hoặc khóa không
            if (product.author.isDeleted || product.author.account_status === 'locked') {
                return res.status(403).json({ error: 'Product is not available' });
            }
            res.json(product);
        })
        .catch(error => {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

//trang này hiển thị product cho viewpost ( xem các bài ở trạng thái chờ duyệt)
exports.getAllProductsByUser = (req, res) => {
    const userId = req.user.id;

    // Kiểm tra trạng thái của người dùng
    User.findById(userId).then(user => {

        if (!user || user.isDeleted || user.account_status === 'locked') {
            return res.status(403).json({ error: 'User is not available' });
        }

        //Product.find({ author: userId, admin_approved: true })
        Product.find({ author: userId, isDeleted: false })
            .then(products => {
                res.json(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal server error' });
            });
    });
};


exports.getproductdaduyet = (req, res) => {
    try {
        Product.find({ admin_approved: true, isDeleted: false })  // Ensure products are not soft deleted
            .populate({
                path: 'author',
                match: { isDeleted: false, account_status: 'active' }  // Ensure authors are not soft deleted and their account is active
            })
            .then(products => {
                // Filter out products whose author is not soft deleted and has an active account
                const filteredProducts = products.filter(product => product.author);
                if (filteredProducts.length === 0) {
                    return res.status(404).json({ message: 'Không có sản phẩm phù hợp.' });
                }
                // Return the filtered list of products
                res.json(filteredProducts);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal server error' });
            });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Hàm xử lý hiển thị tất cả các sản phẩm giá trị true cho trang listproduct
// chức năng này chưa được sử dụng
exports.getAllProducts = (req, res) => {
    Product.find({ admin_approved: true, isdeleted: false })
        .then(products => {
            res.send(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, address } = req.body;
        const { province, district, ward } = address || {};

        const userId = req.user._id;

        const product = new Product({
            name,
            price,
            description,
            images,
            category,
            address: {
                province,
                district,
                ward
            },
            author: userId
        });

        // Save product to the database
        const savedProduct = await product.save();
        cache.clear();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Err 500" });
    }
};


  exports.updateProductById = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const { name, price, description, images, category, address } = req.body;
        const { province, district, ward } = address || {};
        // Lấy id của sản phẩm cần cập nhật
        const productId = req.params.productId;

        // Tìm sản phẩm cần chỉnh sửa trong cơ sở dữ liệu
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(402).json({ error: "Product not found" });
        }

        // Kiểm tra xem người dùng hiện tại có phải là tác giả của sản phẩm không
        const userId = req.user.id;
        if (product.author.toString() !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        product.name = name;
        product.price = price;
        product.description = description;
        product.images = images;
        product.category = category;
        product.address = {
            province,
            district,
            ward
        };

        //         // Nếu bài viết đã bị từ chối, cho phép gửi lại sau khi chỉnh sửa
        if (product.admin_rejected) {
            product.admin_approved = false; // Reset trạng thái admin duyệt
            product.admin_rejected = false; // Reset trạng thái bị từ chối
            product.admin_rejected_reason = null; // Xóa lý do từ chối cũ
            product.resubmitted = true; // Đánh dấu rằng bài viết đã được gửi lại sau khi chỉnh sửa
        }
        // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
        const updatedProduct = await product.save();
        cache.clear();

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product");
    }
};

//xóa cứng
// exports.deleteProductById = (req, res) => {
//     try {
//         const userId = req.user.id;
//         // Lấy id của sản phẩm cần xóa
//         const productId = req.params.productId;
//         // Tìm sản phẩm trong cơ sở dữ liệu
//         Product.findById(productId)
//             .then(product => {
//                 // Kiểm tra xem sản phẩm có tồn tại không
//                 if (!product) {
//                     return res.status(404).json({ error: 'Product not found' });
//                 }
//                 // Kiểm tra xem người dùng hiện tại có phải là tác giả của sản phẩm không
//                 if (product.author.toString() !== userId) {
//                     return res.status(401).json({ error: 'Unauthorized' });
//                 }
//                 // Xóa sản phẩm khỏi cơ sở dữ liệu
//                 Product.findByIdAndDelete(productId)
//                     .then(() => {
//                         res.json({ message: 'Product deleted successfully' });
//                     })
//                     .catch(error => {
//                         console.error('Error deleting product:', error);
//                         res.status(500).json({ error: 'Delete operation failed' });
//                     });
//             })
//             .catch(error => {
//                 console.error('Error finding product:', error);
//                 res.status(500).json({ error: 'Internal server error' });
//             });
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
exports.deleteProductById = (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            if (product.author.toString() !== userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            // Thay vì xóa, cập nhật trạng thái isDeleted và thêm thời gian xóa
            Product.findByIdAndUpdate(productId, { isDeleted: true, deletedAt: new Date() }, { new: true })
            
                .then(() => {
                    cache.clear();

                    res.json({ message: 'Product deleted successfully' });
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    res.status(500).json({ error: 'Delete operation failed' });
                });
        })
        .catch(error => {
            console.error('Error finding product:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


