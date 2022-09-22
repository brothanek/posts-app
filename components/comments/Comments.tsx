import { useEffect, useState } from 'react'
import { CommentInput } from './CommentInput'
import Comment from './Comment'
import type { CommentProps } from 'types'

export interface CommentsState {
	articleId: string
	comments: CommentProps[]
}
export const Comments = (data: CommentsState) => {
	const [{ comments, articleId }, setState] = useState<CommentsState>(data || { articleId: '', comments: [] })

	useEffect(() => {
		if (articleId !== data.articleId) {
			setState({ ...data })
		}
	}, [articleId, data])

	return (
		<div className="pt-7 pb-20 w-full">
			<h4>Comments</h4>

			<CommentInput articleId={articleId} setState={setState} />

			{comments.map((comment) => (
				<Comment key={comment._id} comments={comments} setState={setState} {...comment} />
			))}
		</div>
	)
}
