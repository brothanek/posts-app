import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { FormattedRelativeTime } from 'react-intl'
import { Avatar } from '@components/Avatar'
import { useAuth } from '@contexts/AuthContext'
import type { CommentsState } from './Comments'
import type { CommentProps } from 'types'

type CommentPropsWithState = CommentProps & {
	setState: React.Dispatch<React.SetStateAction<CommentsState>>
	comments: CommentProps[]
}

const getDiff = (date: string) => (new Date(date).valueOf() - new Date().valueOf()) / 1000

const Comment = ({
	author = '',
	content = 'Content',
	createdAt = '',
	_id = '',
	articleId = '',
	setState = () => {},
}: CommentPropsWithState) => {
	const [dateDiff, setDateDiff] = useState<number>(0)
	const { user } = useAuth()

	// hydration problem fix
	useEffect(() => {
		setDateDiff(getDiff(createdAt))
	}, [createdAt])

	const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault()
		if (!window.confirm('Do you want to delete your comment?')) return
		try {
			await axios.delete(`/api/comments/${_id}`, { data: { articleId } })
			setState((curState) => {
				const newComments = curState.comments.filter((comment) => comment._id !== _id)
				return { ...curState, comments: newComments }
			})

			toast.success('Comment deleted')
		} catch (e: any) {
			toast.error(e.response.data.message)
		}
	}

	return (
		<div className="flex mt-4 items-start overflow-scroll pb-4">
			<Avatar username={author} />
			<div className="max-w-md">
				<div className="flex items-center">
					<span className="font-bold text-sm">{author}</span>
					<span className="ml-2 text-sm text-gray-500">
						<FormattedRelativeTime value={dateDiff} numeric="auto" updateIntervalInSeconds={1} />
					</span>
					{author == user.username && (
						<span className="ml-4">
							<button onClick={handleDelete}>
								<AiOutlineDelete size="16" />
							</button>
						</span>
					)}
				</div>

				<p className="text-sm whitespace-pre">{content}</p>
			</div>
		</div>
	)
}
export default Comment
