import mongoose from 'mongoose';

const Blacklist = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('Blacklist', Blacklist);
