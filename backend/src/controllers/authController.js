import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Blacklist from '../models/Blacklist.js';
import { generatePasswordResetEmailContent } from "../utils/emailContent.js";
import { sendEmail } from "../services/emailService.js";
import path from 'path';

// Utility function to check if the email is in the blacklist
const isEmailBlacklisted = async (email) => {
    const blacklisted = await Blacklist.findOne({ email });
    return !!blacklisted;
};

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            cin,
            phoneNumber,
            address,
            studies
        } = req.body;

        // Check if email is blacklisted
        if (await isEmailBlacklisted(email)) {
            return res.status(403).json({
                message: 'This email is not allowed to register.'
            });
        }

        let existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'A user with this email or phone number already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePhotoPath = null;
        if (req.file) {
            profilePhotoPath = `/uploads/${req.user.id}/${path.basename(req.file.path)}`;
        } else {
            profilePhotoPath = `/uploads/defaultProfilePhoto.png`;
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            cin,
            phoneNumber,
            address,
            profilePhoto: profilePhotoPath,
            role: "student"
        });

        await newUser.save();

        if (studies) {
            newUser.studies = studies;
            await newUser.save()
        }

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is blacklisted
        if (await isEmailBlacklisted(email)) {
            return res.status(403).json({
                message: 'This email is not allowed to login.'
            });
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
