import mongoose from 'mongoose'

export interface IUser {
	username: string
	password: string
	createdAt: Date
}

type UserModel = mongoose.Model<IUser>

const schema = new mongoose.Schema<IUser, UserModel>({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: () => new Date(), immutable: true },
})

export default mongoose.models.User || mongoose.model<IUser, UserModel>('User', schema)
