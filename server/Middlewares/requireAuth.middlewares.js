import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized user!"
            });
        }

        const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

        if (!verifiedToken) {
            return res.status(401).json({
                message: "Invalid token!"
            });
        }

        req.userId = verifiedToken.userId; // Store userId in request object

        next();

    } catch (error) {
        console.error("Token verification error: ", error);
        return res.status(401).json({
            message: "Invalid token!",
            errorMessage: error.message // Provide detailed error message
        });
    }
};

export default authMiddleware;
