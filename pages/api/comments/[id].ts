import nc from 'next-connect'
import Comment from 'models/Comment'
import Article from 'models/Article'
import auth from 'middleware/auth'
import type { NextApiResponse } from 'next'
import type { CommentProps, NextApiRequestWithUser } from 'types'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
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
	.use(auth)
	.use(async (req, res, next) => {
		const { id } = req.query
		const authCheck = req.user.username === (await Comment.findById(id)).author
		if (!authCheck) return res.status(400).json({ success: false, error: { message: 'Not authorized' } })
		next()
	})
	.patch(async (req, res) => {
		const { id } = req.query

		try {
			const { _id, articleId, author, content, createdAt } = req.body
			const body = { _id, articleId, author, content, createdAt } as CommentProps
			const comment = await Comment.findByIdAndUpdate(id, body)
			return res.status(200).json({ success: true, data: comment, message: 'Comment successfully updated' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})
	.delete(async (req, res) => {
		const { id } = req.query
		const { articleId } = req.body
		try {
			// delete comment from article
			console.log(articleId, 'articleId')
			const article = await Article.findById(articleId)
			article.comments = article.comments.filter((comment: CommentProps) => comment._id != id)
			await article.save()
			// delete comment
			await Comment.findByIdAndDelete(id)
			return res.status(200).json({ message: 'Successfully deleted' })
		} catch (error) {
			console.log(error)
			return res.status(400).json({ success: false, error })
		}
	})

export default handler
