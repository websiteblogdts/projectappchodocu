const Product = require('../models/Product');
const mongoose = require('mongoose');


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

// exports.createProduct = async (req, res) => {
//     try {
//         // Kiểm tra dữ liệu đầu vào
//         if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.body.address) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         // Tạo đối tượng sản phẩm từ dữ liệu nhận được từ frontend
//         const product = new Product({
//             name: req.body.name,
//             price: req.body.price,
//             description: req.body.description,
//             image: req.body.image,
//             category: req.body.category,
//             address: req.body.address
//         });

//         // Lưu sản phẩm vào cơ sở dữ liệu
//         const savedProduct = await product.save();

//         res.status(201).json(savedProduct);
//     } catch (error) {
//         console.error("Error creating product:", error);
//         res.status(500).send("Error creating product");
//     }
// };
exports.createProduct = async (req, res) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.body.address.province || !req.body.address.district || !req.body.address.ward) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Tạo đối tượng sản phẩm từ dữ liệu nhận được từ frontend
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
        }
      });
  
      // Lưu sản phẩm vào cơ sở dữ liệu
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send("Error creating product");
    }
  };
exports.updateProductById = async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.body.address) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Tìm sản phẩm cần chỉnh sửa trong cơ sở dữ liệu
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
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
    const productId = req.params.productId;
    Product.findByIdAndDelete(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ message: 'Oke rui son, Product deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'xoa khong thanh cong' });
        });
};

