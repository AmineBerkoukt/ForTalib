import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Evaluate from '../models/Evaluate.js';
import Favorise from '../models/Save.js';
import Message from '../models/Message.js';
import Request from '../models/Request.js';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const seedDB = async () => {
    try {

        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Evaluate.deleteMany({});
        await Favorise.deleteMany({});
        await Message.deleteMany({});
        await Request.deleteMany({});

        // Create users
        const users = [];
        for (let i = 0; i < 10; i++) {
            const hashedPassword = await bcrypt.hash(`password${i}`, 10);
            const user = new User({
                firstName: `FirstName${i}`,
                lastName: `LastName${i}`,
                email: `user${i}@example.com`,
                password: hashedPassword,
                cin: `CIN${i}`,
                phoneNumber: `061234567${i}`,
                address: `Address${i}`,
                role: i === 0 ? 'admin' : i % 2 === 0 ? 'house_owner' : 'student',
                profilePhoto: `https://i.pravatar.cc/150?img=${i}`, // Utilisation d'avatars aléatoires
            });
            users.push(await user.save());
        }

        // Create posts with real images
        const posts = [];
        for (let i = 0; i < 20; i++) {
            const post = new Post({
                userId: users[i % users.length]._id,
                title: `Post Title ${i}`,
                description: `Post Description ${i}`,
                images: [
                    `https://picsum.photos/seed/${i}/600/400`, // Image aléatoire de Lorem Picsum
                    `https://picsum.photos/seed/${i + 1}/600/400`, // Une deuxième image
                ],
                price: Math.floor(Math.random() * 1000),
                address: `Post Address ${i}`,
                elevator: i % 2 === 0,
                maximumCapacity: Math.floor(Math.random() * 10) + 1,
                avgRate: Math.floor(Math.random() * 5) + 1,
            });
            posts.push(await post.save());
        }

        // Create evaluations
        for (let i = 0; i < 30; i++) {
            const evaluate = new Evaluate({
                userId: users[i % users.length]._id,
                postId: posts[i % posts.length]._id,
                rate: Math.floor(Math.random() * 5) + 1,
            });
            await evaluate.save();
        }

        // Create favorites
        for (let i = 0; i < 20; i++) {
            const favorise = new Favorise({
                userId: users[i % users.length]._id,
                postId: posts[i % posts.length]._id,
            });
            await favorise.save();
        }

        // Create messages
        for (let i = 0; i < 50; i++) {
            const message = new Message({
                senderId: users[i % users.length]._id,
                receiverId: users[(i + 1) % users.length]._id,
                text: `Message ${i}`,
                image: `https://picsum.photos/seed/message${i}/200/200`, // Image aléatoire pour les messages
            });
            await message.save();
        }

        // Create requests
        for (let i = 0; i < 10; i++) {
            const request = new Request({
                userId: users[i % users.length]._id,
                status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'accepted' : 'rejected',
            });
            await request.save();
        }

        console.log('Database seeded successfully with real images');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDB();