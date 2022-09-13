import mongoose from 'mongoose'
import { commentSchema } from './Comment'

const articleSchema = new mongoose.Schema({
	author: { type: String, required: true, maxLength: 20 },
	title: { type: String, required: true, maxLength: 80 },
	perex: { type: String, required: true, maxLength: 200 },
	content: { type: String, required: true, maxLength: 3000 },
	cloudinary_img: { url: String, id: String },
	updatedAt: Date,
	createdAt: { type: Date, default: () => new Date(), immutable: true },
	comments: [commentSchema],
})

export default mongoose.models.Article || mongoose.model('Article', articleSchema)