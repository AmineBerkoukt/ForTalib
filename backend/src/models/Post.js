import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    address: { type: String, required: true },
    elevator: { type: Boolean, default: false },
    maximumCapacity: { type: Number, required: true, min: 0 },
    creationDate: { type: Date, default: Date.now },
    avgRate: { type: Number, default: 0 }
}, { timestamps: true } );

export default mongoose.model('Post', PostSchema);
