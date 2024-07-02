import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../Models/auth.models.js"

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required details.",
                success: false
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                message: "User already exists.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = await newUser.save();

        const token = jwt.sign({ userId: userResponse._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({
            message: "User registered successfully.",
            name: userResponse.name,
            token: token,
        });

    } catch (err) {
        console.error("Registration error: ", err);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide all required credentials.",
                success: false
            });
        }

        const registeredUser = await User.findOne({ email });

        if (!registeredUser) {
            return res.status(404).json({
                message: "User does not exist.",
                success: false
            });
        }

        const matchedPassword = await bcrypt.compare(password, registeredUser.password);

        if (!matchedPassword) {
            return res.status(401).json({
                message: "Invalid password.",
                success: false
            });
        }

        const token = jwt.sign({ userId: registeredUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "User logged in successfully.",
            name: registeredUser.name,
            token: token
        });

    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, oldPassword, newPassword } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        if (name) {
            user.name = name;
        }

        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid old password.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({
            message: 'User information updated successfully.',
            name: user.name,
        });
    } catch (error) {
        console.error("Update error: ", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const Logout = async (req, res) => {
    try {
        // Assuming we store blacklisted tokens in an in-memory store or database
        const token = req.headers.authorization.split(' ')[1];
        // Add token to blacklist (pseudo-code, implement according to your storage)
        // await addToBlacklist(token);

        res.status(200).json({
            message: "User logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error("Logout error: ", error);
        res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
