import nc from 'next-connect'
import connectDB from 'api-lib/mongodb'

import type { NextApiRequest, NextApiResponse } from 'next'
import Comment from 'models/Comment'

const handler = nc<NextApiRequest, NextApiResponse>()
	.get(async (req, res) => {
		const { id } = req.query
		try {
			const article = await Comment.findById(id)
			res.status(200).json({ success: true, data: article })
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})
	.patch(async (req, res) => {
		const { id } = req.query
		try {
			const comment = await Comment.findByIdAndUpdate(id, req.body)
			return res.status(200).json({ success: true, data: comment, message: 'Comment successfully updated' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})
	.delete(async (req, res) => {
		const { id } = req.query
		try {
			await Comment.findByIdAndDelete(id)
			return res.status(200).json({ message: 'Successfully deleted' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})

export default connectDB(handler)
