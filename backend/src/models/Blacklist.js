import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true },
    role: String,
    password: String,
    profilePicture: String,
    bannedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Blacklist", BlacklistSchema);