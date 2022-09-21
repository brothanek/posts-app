import nc from 'next-connect'
import { v2 as cloudinary } from 'cloudinary'
import Article from 'models/Article'
import auth from 'middleware/auth'
import dbConnect from 'lib/dbConnect.ts'
import type { ArticleProps, NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'

export const getArticle = async (id: string | string[]) => {
	await dbConnect()
	return (await Article.findById(id)) as ArticleProps
}

const CLOUDINARY_URL = process.env.CLOUDINARY_URL

// delete image from Cloudinary
const deleteImage = async (id: string) => {
	const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(CLOUDINARY_URL || '')
	cloudinary.config({
		cloud_name,
		api_key,
		api_secret,
	})
	return await cloudinary.uploader.destroy(id)
}

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(auth)
	.use(async (req, res, next) => {
		// Article auth middleware
		const { id } = req.query
		const { privateDoc, author } = await Article.findById(id)
		const isAuthor = author === req.user.username

		if ((req.method === 'GET' && privateDoc && !isAuthor) || !isAuthor) {
			return res.status(401).json({ success: false, error: 'Unauthorized' })
		}
		next()
	})

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
		const { title, content, perex, privateDoc, cloudinary_img } = req.body as ArticleProps

		try {
			const article = await Article.findByIdAndUpdate(id, { title, content, perex, cloudinary_img, privateDoc })
			return res.status(200).json({ success: true, data: article, message: 'Article successfully updated' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})
	// delete article and cloudinary image
	.delete(async (req, res) => {
		const { id } = req.query
		try {
			const article = await Article.findByIdAndDelete(id)
			await deleteImage(article.cloudinary_img)
			return res.status(200).json({ success: true, message: 'Article deleted' })
		} catch (e) {
			console.log(e)
			return res.status(401).json({ message: e })
		}
	})

export default handler
