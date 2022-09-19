import mongoose from 'mongoose'
import { commentSchema } from './Comment'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const articleSchema = new mongoose.Schema({
	author: { type: String, required: true, maxLength: 20 },
	privateDoc: { type: Boolean, default: false },
	title: { type: String, required: true, maxLength: 80 },
	perex: { type: String, required: true, maxLength: 200 },
	content: { type: String, required: true, maxLength: 3000 },
	cloudinary_img: { url: String, id: String },
	updatedAt: Date,
	createdAt: { type: Date, default: () => new Date(), immutable: true },
	comments: [commentSchema],
})
articleSchema.plugin(aggregatePaginate)

export default mongoose.models.Article || mongoose.model('Article', articleSchema)
