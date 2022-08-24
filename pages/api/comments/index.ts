import nc from 'next-connect'

import type { NextApiRequest, NextApiResponse } from 'next'
import Comment from 'models/Comment'
import Article from 'models/Article'

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const body = req.body
	const { articleId } = body
	try {
		const comment = new Comment(req.body)
		await comment.save()
		const article = await Article.findById(articleId)
		article.comments.unshift(comment)
		article.save()

		return res.status(200).json({ success: true, comment, message: 'Comment added' })
	} catch (error) {
		console.log(error)
		return res.status(400).json({ success: false, error })
	}
})

export default handler
