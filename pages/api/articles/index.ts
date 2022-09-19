import nc from 'next-connect'
import Article from 'models/Article'
import dbConnect from 'lib/dbConnect.ts'
import auth from 'middleware/auth'
import { ArticleProps, NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'

export const getUserArticles = async (username: string) => {
	await dbConnect()
	return await Article.find({ author: username }).sort({ createdAt: -1 })
}
export const getArticles = async () => {
	await dbConnect()
	return await Article.find().sort({ createdAt: -1 })
}

const CONFIG = { page: '1', limit: '8', sort: { createdAt: 'desc' } }

export const getPaginatedArticles = async (options = CONFIG) => {
	await dbConnect()
	var myAggregate = Article.aggregate()
	// @ts-ignore
	return await Article.aggregatePaginate(myAggregate, options, function (err, results) {
		if (err) {
			console.error(err)
			return []
		} else {
			return results
		}
	})
}

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.get(async (req, res) => {
		await dbConnect()

		const { page, limit, sort } = req.query
		const options = {
			page: page + '' || CONFIG.page,
			limit: limit + '' || CONFIG.limit,
			sort: { createdAt: sort + '' || CONFIG.sort.createdAt },
		}
		try {
			if (page || limit || sort) {
				const articles = await getPaginatedArticles(options)
				res.status(200).json(articles)
			} else {
				const articles = await getArticles()
				res.status(200).json(articles)
			}
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
