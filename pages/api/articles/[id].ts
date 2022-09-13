import nc from 'next-connect'
import Article from 'models/Article'
import auth from 'middleware/auth'
import dbConnect from 'lib/dbConnect.ts'
import type { ArticleProps, NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'

export const getArticle = async (id: string | string[]) => {
	await dbConnect()
	return (await Article.findById(id)) as ArticleProps
}

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.get(async (req, res) => {
		await dbConnect()
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
	.use(auth)
	.use(async (req, res, next) => {
		const { id } = req.query
		const authCheck = req.user.username === (await Article.findById(id)).author
		if (!authCheck) return res.status(400).json({ success: false, error: { message: 'Not authorized' } })
		next()
	})
	.patch(async (req, res) => {
		const { id } = req.query
		const { title, content, perex, author, cloudinary_img } = req.body as ArticleProps

		try {
			const article = await Article.findByIdAndUpdate(id, { title, content, perex, cloudinary_img })
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

export default handler
