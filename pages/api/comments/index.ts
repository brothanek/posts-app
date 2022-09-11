import nc from 'next-connect'
import Article from 'models/Article'
import auth from 'middleware/auth'
import Comment from 'models/Comment'
import type { NextApiResponse } from 'next'
import type { CommentProps, NextApiRequestWithUser } from 'types'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(auth)
	.use(async (req, res, next) => {
		const { id } = req.query
		const authCheck = req.user.username === req.body.author
		if (!authCheck) return res.status(400).json({ success: false, error: { message: 'Not authorized' } })
		next()
	})
	.post(async (req, res) => {
		const { articleId, author, content } = req.body as CommentProps
		try {
			const comment = new Comment({ articleId, author, content } as CommentProps)
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
