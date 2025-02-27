import mongoose from 'mongoose';

const SaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

export default mongoose.model('Save', SaveSchema);