import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {generatePasswordResetEmailContent} from "../utils/emailContent.js";
import {sendEmail} from "../services/emailService.js";
import Blacklist from "../models/Blacklist.js";
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            cin,
            phoneNumber,
            hasAcceptedTermsAndConditions // Add this line
        } = req.body;

        let existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'A user with this email or phone number already exists'
            });
        }

        const isBanned = await Blacklist.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (isBanned) {
            return res.status(403).json({ message: "This email or phone number is banned from the platform." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            cin,
            phoneNumber,
            role: "student",
            hasAcceptedTermsAndConditions: hasAcceptedTermsAndConditions || false // Add this line, defaulting to false
        });

        await newUser.save();


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
                role: newUser.role,
                hasAcceptedTermsAndConditions: newUser.hasAcceptedTermsAndConditions //Add this line
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during registration',
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isBanned = await Blacklist.findOne({ email });
        if (isBanned) {
            return res.status(400).json({ message: "You are banned from this platform." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect email or password!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect email or password !!'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || 'my_jwt_secret',
            {
                expiresIn: '30d',
                algorithm: 'HS256'
            }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during login',
            error: error.message
        });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'this email address doesn\'t exists'
            });
        }

        const resetToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || 'my_jwt_secret',
            {
                expiresIn: '1h',
                algorithm: 'HS256'
            }
        );

        const resetLink = `${process.env.EMAIL_REDIRECT}/reset-password/${resetToken}`;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; //1H
        await user.save();

        const { subject, htmlContent } = generatePasswordResetEmailContent(
            user.firstName,
            user.lastName,
            resetLink
        );
        await sendEmail(user.email, subject, htmlContent);

        res.status(200).json({
            message: 'a password reset link received !'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error occurred during password reset request.',
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_jwt_secret');

        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'The reset link is invalid or has expired.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Your password has been successfully reset.'
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({
                message: 'The reset link is invalid.'
            });
        }
        res.status(500).json({
            message: 'Error occurred during password reset.',
            error: error.message
        });
    }
};
