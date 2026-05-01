import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPost extends Document {
    title: string;
    summary: string;
    content: string;
    cover?: string;
    category: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    cover: String,
    category: { type: String, default: 'Other' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

const PostModel = model<IPost>('Post', PostSchema);
export default PostModel;
