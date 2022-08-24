import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: () => new Date(), immutable: true },
})

export default mongoose.models.User || mongoose.model('User', userSchema)
