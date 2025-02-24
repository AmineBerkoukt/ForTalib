import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

export default mongoose.model('Notification', NotificationSchema);
