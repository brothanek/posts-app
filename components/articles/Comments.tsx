import axios from 'axios'
import { useEffect, useState } from 'react'
import { FormattedRelativeTime } from 'react-intl'
import toast from 'react-hot-toast'
import { Avatar } from '@components/Avatar'

import type { CommentProps } from 'types'

const getDiff = (date: string) => (new Date(date).valueOf() - new Date().valueOf()) / 1000

const Comment = ({ author = 'Ondra B.', content = 'Content', createdAt = '' }) => {
	const [diff, setDiff] = useState<number>(0)
	// hydration problem fix
	useEffect(() => {
		setDiff(getDiff(createdAt))
	}, [createdAt])
	return (
		<div className="flex mt-4">
			<Avatar />
			<div>
				<div className="flex items-center mb-2">
					<span className="font-bold text-sm">{author}</span>
					<span className="ml-2 text-sm text-gray-500">
						<FormattedRelativeTime value={diff} numeric="auto" updateIntervalInSeconds={1} />
					</span>
				</div>
				<p className="text-sm">{content}</p>
			</div>
		</div>
	)
}

export const Comments = (props: { comments: CommentProps[]; articleId: string }) => {
	const { articleId } = props
	const [content, setContent] = useState('')
	const [comments, setComments] = useState(props.comments)

	const postComment = async () => {
		const body = { content, articleId, author: 'Ondra' }

		try {
			const { data } = await axios.post('/api/comments', body)
			toast.success(data.message || 'Success')
			setComments([{ ...data.comment }, ...comments])
			setContent('')
		} catch (e) {
			console.log(e)
		}
	}
	const handleKey: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
		if (key == 'Enter' && content) {
			if (!window.confirm('Do you want to submit your comment?')) return
			postComment()
		}
	}
	const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
		setContent(value)
	}
	return (
		<div className="w-full mt-7 mb-4 items-center">
			<h2>{`Comments (${comments.length})`}</h2>
			<div className="flex pt-7">
				<Avatar /> <input value={content} onChange={handleChange} onKeyDown={handleKey} />
			</div>
			{comments.map(({ _id, ...rest }) => (
				<Comment key={_id} {...rest} />
			))}
		</div>
	)
}
