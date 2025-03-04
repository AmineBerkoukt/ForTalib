import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleOAuthRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, googleId } = req.body;

        console.log("Received OAuth data:", req.body);

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            // If the user exists but doesn't have a googleId, update their record
            if (!existingUser.googleId) {
                existingUser.googleId = googleId;
                await existingUser.save();
            }

            // If googleId matches, log the user in
            if (existingUser.googleId === googleId) {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        role: existingUser.role,
                    },
                    process.env.JWT_SECRET || 'my_jwt_secret',
                    {
                        expiresIn: '30d',
                        algorithm: 'HS256'
                    }
                );

                return res.status(200).json({
                    message: 'User logged in successfully',
                    token,
                    user: {
                        id: existingUser._id,
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        email: existingUser.email,
                        role: existingUser.role
                    }
                });
            } else {
                return res.status(400).json({
                    message: 'Google ID mismatch. Please log in with the correct Google account.'
                });
            }
        }

        // If user does not exist, create a new one
        const newUser = new User({
            firstName,
            lastName,
            email,
            googleId,
            role: "student"
        });

        await newUser.save();

        // Generate a JWT token for the new user
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
            message: 'Error during registration/login',
            error: error.message
        });
    }
};
