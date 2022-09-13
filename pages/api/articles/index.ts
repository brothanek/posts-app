import nc from 'next-connect'
import Article from 'models/Article'
import dbConnect from 'lib/dbConnect.ts'
import auth from 'middleware/auth'
import { ArticleProps, NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'

export const getArticles = async (username?: string) => {
	await dbConnect()
	if (username) {
		return await Article.find({ author: username }).sort({ createdAt: -1 })
	}
	return await Article.find().sort({ createdAt: -1 })
}
const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.get(async (req, res) => {
		await dbConnect()
		try {
			const articles = await getArticles()
			res.status(200).json(articles)
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})
	.use(auth)
	.use(async (req, res, next) => {
		const { id } = req.query
		const authCheck = req.user.username === req.body.author
		if (!authCheck) return res.status(400).json({ success: false, error: { message: 'Not authorized' } })
		next()
	})
	.post(async (req, res) => {
		try {
			const { title, content, perex, cloudinary_img } = req.body as ArticleProps
			const article = await Article.create({
				title,
				content,
				perex,
				author: req.user.username,
				comments: [],
				cloudinary_img,
			})

			res.status(200).json({ success: true, data: article, message: 'Article created!' })
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})

export default handler
