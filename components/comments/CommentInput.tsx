import { Dispatch, SetStateAction, useState } from 'react'
import { useAuth } from '@contexts/AuthContext'
import { Avatar } from 'components/Avatar'
import { postComment } from 'lib/calls'
import type { CommentsState } from './Comments'

export const CommentInput = ({
	articleId,
	setState,
}: {
	articleId: string
	setState: Dispatch<SetStateAction<CommentsState>>
}) => {
	const { user } = useAuth()
	const [focused, setFocused] = useState(false)
	const [content, setContent] = useState('')

	const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault()
		if (!window.confirm('Do you want to submit your comment?')) return

		const comment = await postComment(articleId, content)
		console.log(comment)

		if (comment) {
			setState((curState) => {
				const newComments = [comment, ...curState.comments]
				return { ...curState, comments: newComments }
			})
		}
		setContent('')
	}
	const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target: { value } }) => {
		setContent(value)
	}
	return (
		<div className="flex mt-7 items-start">
			<Avatar username={user.username || '?'} />
			<div className="w-full">
				<div className="">
					<textarea
						disabled={!user.authenticated}
						className="textarea textarea-bordered max-w-md w-full max-h-80"
						placeholder={user.authenticated ? 'Join the discussion' : 'Please login to comment'}
						value={content}
						onFocus={() => setFocused(true)}
						onChange={handleChange}
					/>
				</div>
				{focused && (
					<button className="primary-btn text-sm mb-1" onClick={handleSubmit}>
						Add comment
					</button>
				)}
			</div>
		</div>
	)
}
