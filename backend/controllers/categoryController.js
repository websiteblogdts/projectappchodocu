const Category = require('../models/Category');
const cache = require("memory-cache");

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
             return res.status(409).json({ error: "Danh mục đã tồn tại, hoặc có thể đã bị xóa mềm, kiểm tra lại" });
         }
        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save(); // Lưu category vào database
        cache.clear();
        res.status(201).json(savedCategory); // Gửi response với thông tin category đã lưu
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body; // Cập nhật tên hoặc các thuộc tính khác

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }

        if (!name.trim()) {
            return res.status(400).json({ error: "Tên danh mục không được để trống hoặc chỉ chứa khoảng trắng" });
        }

        // Kiểm tra trùng lặp tên danh mục
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(409).json({ error: "Danh mục đã tồn tại, hoặc có thể đã bị xóa mềm, kiểm tra lại" });
        }
        // Cập nhật danh mục
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name: name.trim() }, { new: true, runValidators: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        cache.clear();

        res.status(200).json({ data: updatedCategory, message: "Category updated successfully" });
        // res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.error("Error updating category:", error);
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

exports.getDeletedCategories = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to perform this action" });
        }

        const deletedCategories = await Category.find({ isDeleted: true });

        if (deletedCategories.length === 0) {
            return res.status(404).json({ message: "No deleted categories found" });
        }

        res.status(200).json(deletedCategories);
    } catch (error) {
        console.error("Error retrieving deleted categories:", error);
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
        const deletedCategory = await Category.findByIdAndUpdate(categoryId, {
            isDeleted: true,
            deletedAt: new Date()
        }, { new: true });

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Fetch remaining categories to return updated list
        const remainingCategories = await Category.find({ isDeleted: false });
        cache.clear();

        res.status(200).json(remainingCategories);
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Trong file categoryController.js
exports.restoreCategory = async (req, res) => {
    const { id } = req.params;
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "You are not authorized to perform this action" });
    }

    try {
        const restoreCategory = await Category.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true });

        if (!restoreCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        const remainingCategories = await Category.find({ isDeleted: true });
        cache.clear();
        res.status(200).json({
            message: "Category restored successfully",
            category: restoreCategory,
            remainingCategories: remainingCategories
        });
    } catch (error) {
        console.error("Error restoring category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
