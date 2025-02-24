import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Favorise from '../models/Favorise.js';
import connectDB from '../config/db.js';

dotenv.config();

// Sample Data
const users = [
    { firstName: "Amine", lastName: "BERKOUKT", email: "amine@e.com", password: "123456", phoneNumber: "01", address: "Boughaz", role: "house_owner" },
    { firstName: "Lamiae", lastName: "RANBOUK", email: "lamiae@e.com", password: "123456", phoneNumber: "02", address: "L3wama", role: "admin" },
    { firstName: "Houssam", lastName: "CHERKI", email: "houssam@e.com", password: "123456", phoneNumber: "03", address: "3irfan 2", role: "student" },
    { firstName: "Abdellah", lastName: "BIGAGANE", email: "abdellah@e.com", password: "123456", phoneNumber: "04", address: "Epsilon", role: "student" }
];


const posts = [
    { title: "Cho99a mleee7a", description: "Spacious and well-lit.", images: ["img1.jpg"], price: 1500, address: "Boughaz D2", elevator: true, maximumCapacity: 3 },
    { title: "Sken w Ykon Khir", description: "Perfect for students.", images: ["img2.jpg"], price: 1300, address: "3irfan 2", elevator: false, maximumCapacity: 1 }
];


const seedData = async () => {
    try {
        await connectDB();

        // Step 1: Clear existing data
        await User.deleteMany();
        await Student.deleteMany();
        await Post.deleteMany();
        await Favorise.deleteMany();

        console.log("Database cleared!");

        // Step 2: Insert Users
        const createdUsers = await User.insertMany(users);
        console.log("Users seeded!");

        // Step 3: Filter users with role 'student' for Students collection
        const studentUsers = createdUsers.filter(user => user.role === "student");

        // Map the filtered users to studentData (linking studies only to 'student' users)
        const studentData = studentUsers.map((studentUser, index) => ({
            userId: studentUser._id,
            studies: students[index % students.length].studies // Alternate `studies` data
        }));

        const createdStudents = await Student.insertMany(studentData);
        console.log("Students seeded!");

        // Step 4: Insert Posts (linking users - alternate between all users)
        const postData = posts.map((post, index) => ({
            userId: createdUsers[index % createdUsers.length]._id, // Alternate between users
            ...post
        }));
        const createdPosts = await Post.insertMany(postData);
        console.log("Posts seeded!");

        // Step 5: Insert Favorise (linking posts and students)
        if (createdStudents.length > 0) {
            const favoriseData = [
                { studentId: createdStudents[0]._id, postId: createdPosts[0]._id },
                { studentId: createdStudents[0]._id, postId: createdPosts[1]._id }
            ];
            await Favorise.insertMany(favoriseData);
            console.log("Favorise seeded!");
        } else {
            console.log("No students found to link in Favorise.");
        }

        console.log("Seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error(`Seeding failed: ${error.message}`);
        process.exit(1);
    }
};

//seedData();
