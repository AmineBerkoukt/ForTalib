import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleOAuthRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, googleId } = req.body;

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            // If the user exists but doesn't have a googleId, update and save it
            if (!existingUser.googleId) {
                existingUser.googleId = googleId;
                await existingUser.save();  // <-- Ensure the change is saved!
                console.log("Updated user with Google ID:", existingUser);
            }

            // If googleId matches, log the user in
            if (existingUser.googleId === googleId) {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        role: existingUser.role,
                    },
                    process.env.JWT_SECRET || 'Q1FA:m%t/]MD&ad#/dx%){!V7mP=tBrfX1$t1J8DU+:cz*1]txiuY4vuCdb!nzzD',
                    {
                        expiresIn: '40d',
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
                        googleId: existingUser.googleId,  // <-- Verify response contains googleId
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
            googleId: googleId,
            hasAcceptedTermsAndConditions: true,
            role: "student"
        });

        await newUser.save();
        console.log("New user created:", newUser);

        // Generate a JWT token for the new user
        const token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
            },
            process.env.JWT_SECRET || 'Q1FA:m%t/]MD&ad#/dx%){!V7mP=tBrfX1$t1J8DU+:cz*1]txiuY4vuCdb!nzzD',
            {
                expiresIn: '40d',
                algorithm: 'HS256'
            }
        );

        return res.status(201).json({
            message: 'User successfully registered',
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                googleId: newUser.googleId,  // <-- Verify response contains googleId
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("OAuth Error:", error);
        return res.status(500).json({
            message: 'Error during registration/login',
            error: error.message
        });
    }
};
