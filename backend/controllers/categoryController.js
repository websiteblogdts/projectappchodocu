const Category = require('../models/Category');

//tạo category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body; // Lấy tên category từ request body
        if (!name) {
            return res.status(400).json({ error: "Tên danh mục không được để trống" });
        }
        
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save(); // Lưu category vào database
        res.status(201).json(savedCategory); // Gửi response với thông tin category đã lưu
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}); // Truy vấn tất cả các danh mục
        res.status(200).json(categories); // Trả về danh sách các danh mục
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully", deletedCategory });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
