import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';

async function seedAdminUser() {
    try {

        if (!existingAdmin) {  // Only create if no admin exists
            const hashedPassword = await bcrypt.hash('amine123', 10); // Hash the password

            const adminUser = new User({
                firstName: 'Admin', // Or whatever you want
                lastName: 'User',
                email: 'admin@example.com', // Replace with a real email if needed
                password: hashedPassword,
                role: 'admin',
                phoneNumber: '0600000000' // Example
            });

            await adminUser.save();
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

// Seed the database after the connection is established
mongoose.connection.once('open', () => {
    seedAdminUser();
});