import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
    createdAt: { type: Date, default: Date.now },
    treatedAt: { type: Date, default: null }
});

export default mongoose.model('Request', RequestSchema);