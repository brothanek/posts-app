import mongoose from 'mongoose'

const connectDB = (handler) => async (req, res) => {
	if (mongoose.connections[0].readyState) {
		// Use current db connection
		return handler(req, res)
	}
	// Use new db connection
	mongoose.connect(
		process.env.MONGODB_URI,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
		},
		(err) => {
			if (err) {
				console.log(err)
			} else console.log('MongoDB is connected')
		},
	)
	return handler(req, res)
}

export default connectDB
