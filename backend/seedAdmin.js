import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './src/models/User.js';
import Post from './src/models/Post.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CoRent';

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await User.deleteMany({}); // Deletes all documents in the User collection

        console.log("all users deleted");

        const existingAdmin = await User.findOne({ email: 'amine.berkoukt@gmail.com' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists. Skipping creation.');
            return;
        }

        const hashedPassword = await bcrypt.hash('amine.@.2004', 10);

        const adminUser = new User({
            firstName: 'Admine',
            lastName: 'ADMIN',
            email: 'amine.berkoukt@gmail.com',
            password: hashedPassword,
            phoneNumber: '0674748263',
            role: 'admin'
        });

        await adminUser.save();
        console.log('✅ Admin user created');

        const defaultPost = new Post({
            userId: adminUser._id,
            title: 'Welcome to CoRent',
            description: 'Introduction for the users to a colocation platform for students',
            images: [],
            price: 0,
            avgRate: 0,
            address: 'Default Address',
            elevator: false,
            maximumCapacity: 1
        });

        await defaultPost.save();
        console.log('✅ Default post created v2.0');

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
