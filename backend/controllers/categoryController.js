const Category = require('../models/Category');

//tạo category
exports.createCategory = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }

        const { name } = req.body; // Lấy tên category từ request body
       
        if (!name.trim()) { // Dùng phương thức trim() để loại bỏ khoảng trắng thừa
            return res.status(400).json({ error: "Tên danh mục không được để trống hoặc chỉ chứa khoảng trắng" });
        }
         // Kiểm tra xem danh mục đã tồn tại chưa trước khi thực hiện lưu
         const existingCategory = await Category.findOne({ name: name.trim() });
         if (existingCategory) {
             return res.status(409).json({ error: "Danh mục đã tồn tại" });
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
        // Only retrieve categories that have not been marked as deleted
        const categories = await Category.find({ isDeleted: false }); // Adjusted query to exclude soft-deleted categories
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" }); // Informative message if no categories exist
        }
        res.status(200).json(categories); // Return the list of categories
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// exports.getCategoryById = async (req, res) => {
//     try {
//         const categoryId = req.params.id;
//         const category = await Category.findById(categoryId);

//         if (!category) {
//             return res.status(404).json({ error: "Category not found" });
//         }

//         res.status(200).json(category);
//     } catch (error) {
//         console.error("Error retrieving category:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // Include the isDeleted check to ensure we are not retrieving soft-deleted categories
        const category = await Category.findOne({ _id: categoryId, isDeleted: false });

        if (!category) {
            return res.status(404).json({ error: "Category not found or has been deleted" });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//xóa cứng category
// exports.deleteCategory = async (req, res) => {
//     try {
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ error: "You are not authorized to perform this action" });
//         }

//         const categoryId = req.params.id;
//         const deletedCategory = await Category.findByIdAndDelete(categoryId);

//         if (!deletedCategory) {
//             return res.status(404).json({ error: "Category not found" });
//         }
//         res.status(200).json({ message: "Category deleted successfully", deletedCategory });
//     } catch (error) {
//         console.error("Error deleting category:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
exports.deleteCategory = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }

        const categoryId = req.params.id;
        // Cập nhật danh mục thành đã xóa mềm thay vì xóa vĩnh viễn
        const deletedCategory = await Category.findByIdAndUpdate(categoryId, {
            isDeleted: true,
            deletedAt: new Date()
        }, { new: true });

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
