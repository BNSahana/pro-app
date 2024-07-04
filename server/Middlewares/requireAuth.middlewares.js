import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log('Authorization Header:', authorizationHeader); // Debug log

        if (!authorizationHeader) {
            console.log('No Authorization Header found'); // Debug log
            return res.status(401).json({
                message: "Unauthorized user!"
            });
        }

        const token = authorizationHeader.split(' ')[1];
        console.log('Extracted Token:', token); // Debug log

        if (!token) {
            console.log('No Token found'); // Debug log
            return res.status(401).json({
                message: "Unauthorized user!"
            });
        }

        const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Verified Token:', verifiedToken); // Debug log

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
