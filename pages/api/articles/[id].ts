import nc from 'next-connect'
import connectDB from 'api-lib/mongodb'
import Article from 'models/Article'

import type { NextApiRequest, NextApiResponse } from 'next'

export const getArticle = connectDB(async (id: string | string[]) => {
	return await Article.findById(id)
})

const handler = nc<NextApiRequest, NextApiResponse>()
	.get(async (req, res) => {
		const { id } = req.query
		try {
			if (!id) return res.status(400).json({ success: false, error: { message: 'No id provided' } })
			const article = await getArticle(id)
			res.status(200).json(article)
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})
	.patch(async (req, res) => {
		const { id } = req.query
		try {
			const article = await Article.findByIdAndUpdate(id, req.body)
			return res.status(200).json({ success: true, data: article, message: 'Article successfully updated' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})
	.delete(async (req, res) => {
		const { id } = req.query
		try {
			await Article.findByIdAndDelete(id)
			return res.status(200).json({ message: 'Successfully deleted' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})

export default connectDB(handler)
