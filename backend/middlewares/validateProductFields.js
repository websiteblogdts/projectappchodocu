const validateProductFields = (req, res, next) => {
    const { name, price, description, images, category, address } = req.body;
    const { province, district, ward } = address || {};

    if (!name || !price || !description || !images || !category || !province || !district || !ward) {
        return res.status(400).json({ error: "Kiểm tra xem bạn có để trống cái gì chưa điền không nhé sơn dz <3" });
    }
    if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "Chưa có hình ảnh được chọn. Cần ít nhất 1 ảnh" });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: "Giá sản phẩm phải là một số không âm." });
    }

    next();
};

module.exports = validateProductFields;
