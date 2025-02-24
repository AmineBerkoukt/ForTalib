import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
    totalUsers: { type: Number, required: true },
    postsCount: { type: Number, required: true },
    statsDate: { type: Date, default: Date.now }
});

export default mongoose.model('Stats', StatsSchema);
