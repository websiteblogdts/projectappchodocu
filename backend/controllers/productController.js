const Product = require('../models/Product');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Gcd191140";
const { ValidationError } = require('mongoose').Error;

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

// Hàm xử lý hiển thị tất cả các sản phẩm
exports.getAllProducts = (req, res) => {
    Product.find({})
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

      // Kiểm tra dữ liệu đầu vào
      if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.body.address.province || !req.body.address.district || !req.body.address.ward) {
        return res.status(400).json({ error: "Kiểm tra xem bạn có để trống cái gì chưa điền không nhé sơn <3" });
      }
      const userId = req.user.id;

      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        address: {
          province: req.body.address.province,
          district: req.body.address.district,
          ward: req.body.address.ward
        },
        author: userId
    });
  
      // Lưu sản phẩm vào cơ sở dữ liệu
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
        if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.body.address) {
            return res.status(400).json({ error: "Missing required fields" });
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

        // Cập nhật thông tin sản phẩm
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.body.image;
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

