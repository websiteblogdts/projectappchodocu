const Product = require('../models/Product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Gcd191140";
const User = require('../models/User');
const { isValidimages } = require('../middlewares/validator');

exports.getRoutes = (req, res) => {
    res.send('Hello son');
};

// Hàm xử lý hiển thị đetail product
exports.getProductById = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(product);
        })
        .catch(error => {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
// product theo user
exports.getAllProductsByUser = (req, res) => {
    try {
        // Trích xuất userId từ req.user
        const userId = req.user.id;

        // Tìm tất cả các sản phẩm mà author trùng khớp với userId
        Product.find({ author: userId })
            .then(products => {
                // Trả về danh sách các sản phẩm
                res.json(products);
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

exports.getproductdaduyet = (req, res) => {
    try {
        Product.find({  admin_approved: true })
            .then(products => {
                // Trả về danh sách các sản phẩm
                res.json(products);
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
exports.getAllProducts = (req, res) => {
    Product.find({  admin_approved: true })
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

        // Validate input data
        if (!name || !price || !description || !images || !category || !province || !district || !ward) {
            return res.status(400).json({ error: "Kiểm tra xem bạn có để trống cái gì chưa điền không nhé sơn <3" });
        }
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: "Chưa có hình ảnh được chọn." });
        }
        // Ensure price is a non-negative number
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ error: "Giá sản phẩm phải là một số không âm." });
        }

        const userId = req.user.id;

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
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Sai định dạng nội dung điền, kiểm tra lại có thể là bạn điền chữ vào giá cả" });
    }
};

  exports.updateProductById = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const { name, price, description, images, category, address } = req.body;
        const { province, district, ward } = address || {};

        // Validate input data
        if (!name || !price || !description || !images || !category || !province || !district || !ward) {
            return res.status(400).json({ error: "Kiểm tra xem bạn có để trống cái gì chưa điền không nhé sơn <3" });
        }
         // Ensure price is a non-negative number
         if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ error: "Giá sản phẩm phải là một số không âm." });
        }
        // Lấy id của sản phẩm cần cập nhật
        const productId = req.params.productId;

        // Tìm sản phẩm cần chỉnh sửa trong cơ sở dữ liệu
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Kiểm tra xem người dùng hiện tại có phải là tác giả của sản phẩm không
        const userId = req.user.id;
        if (product.author.toString() !== userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // const product = new Product({
        //     name,
        //     price,
        //     description,
        //     images,
        //     category,
        //     address: {
        //         province,
        //         district,
        //         ward
        //     },
        //     author: userId
        // });
        // Cập nhật thông tin sản phẩm
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.images = req.body.images;
        product.category = req.body.category;
        product.address = req.body.address;

        // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product");
    }
};

exports.deleteProductById = (req, res) => {
    try {
        const userId = req.user.id;
        // Lấy id của sản phẩm cần xóa
        const productId = req.params.productId;
        // Tìm sản phẩm trong cơ sở dữ liệu
        Product.findById(productId)
            .then(product => {
                // Kiểm tra xem sản phẩm có tồn tại không
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                // Kiểm tra xem người dùng hiện tại có phải là tác giả của sản phẩm không
                if (product.author.toString() !== userId) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                // Xóa sản phẩm khỏi cơ sở dữ liệu
                Product.findByIdAndDelete(productId)
                    .then(() => {
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
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

