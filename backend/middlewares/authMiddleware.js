
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Gcd191140';

   const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
                if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }
                const decoded = jwt.verify(token, JWT_SECRET);
                req.user = decoded;
                next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

   module.exports = authMiddleware;

