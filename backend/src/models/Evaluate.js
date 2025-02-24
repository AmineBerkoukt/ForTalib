import mongoose from 'mongoose';

const EvaluateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    rate: { type: Number , ref: 'Post'}
});

export default mongoose.model('Evaluate', EvaluateSchema);
