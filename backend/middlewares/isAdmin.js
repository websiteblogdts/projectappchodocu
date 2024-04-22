// middlewares/isAdmin.js

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Bạn không được phép thực hiện hành động này." });
    }
};

module.exports = isAdmin;
