import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/AuthContext'
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
	const {
		user: { authenticated, username },
	} = useAuth()
	const Router = useRouter()
	const [loading, setLoading] = useState(false)
	const [content, setContent] = useState('')

	const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault()

		if (!authenticated) {
			Router.push('/auth?redirect=back')
			return
		}
		setLoading(true)
		const comment = await postComment(articleId, content)
		if (comment) {
			setState((prev) => ({
				...prev,
				comments: [comment, ...prev.comments],
			}))
			setContent('')
		}
		setLoading(false)
	}

	const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target: { value } }) => {
		setContent(value)
	}
	return (
		<div className="flex mt-7 items-start">
			<Avatar username={username || '?'} />
			<div className="w-full">
				<div>
					<textarea
						disabled={!authenticated}
						className="textarea textarea-bordered max-w-md w-full max-h-80"
						placeholder={authenticated ? 'Join the discussion' : 'Please login to comment'}
						value={content}
						onChange={handleChange}
					/>
				</div>
				<button
					disabled={!!authenticated && (loading || !content)}
					className="primary-btn text-sm mb-1"
					onClick={handleSubmit}
				>
					{authenticated ? 'Add comment' : 'Login'}
				</button>
			</div>
		</div>
	)
}
