import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleOAuthRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, googleId } = req.body;

        // Check if a user with the same email or googleId already exists
        let existingUser = await User.findOne({
            $or: [{ email }, { googleId }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'A user with this email or Google ID already exists'
            });
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            googleId,
            role: "student"
        });

        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
            },
            process.env.JWT_SECRET || 'my_jwt_secret',
            {
                expiresIn: '30d',
                algorithm: 'HS256'
            }
        );

        res.status(201).json({
            message: 'User successfully registered',
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during registration',
            error: error.message
        });
    }
};
