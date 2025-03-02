import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    cin: { type: String, required: false },
    phoneNumber: { type: String, required: false, unique: true },
    role: { type: String, required: true, enum: ['admin', 'house_owner', 'student'] },
    profilePhoto: { type: String, required: false },
    bannedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Blacklist", BlacklistSchema);