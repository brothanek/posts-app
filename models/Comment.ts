import mongoose from 'mongoose'

export const commentSchema = new mongoose.Schema({
	articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
	author: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, default: () => new Date(), immutable: true },
})

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema)
