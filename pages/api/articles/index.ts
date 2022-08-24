import nc from 'next-connect'
import Article from 'models/Article'
import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from 'api-lib/mongodb'

export const getArticles = connectDB(async () => {
	return await Article.find().sort({ createdAt: -1 })
})
const handler = nc<NextApiRequest, NextApiResponse>()
	.get(async (req, res) => {
		try {
			const articles = await getArticles()
			res.status(200).json(articles)
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})
	.post(async (req, res) => {
		try {
			const article = await Article.create(req.body)
			res.status(200).json({ success: true, data: article, message: 'Article created!' })
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})

export default connectDB(handler)
