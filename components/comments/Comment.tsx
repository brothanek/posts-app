import { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { FormattedRelativeTime } from 'react-intl'
import Linkify from 'linkify-react'
import { Avatar } from 'components/Avatar'
import { useAuth } from 'contexts/AuthContext'
import { deleteComment } from 'lib/calls'
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
		await deleteComment(_id, articleId)
		setState((curState) => {
			const newComments = curState.comments.filter((comment) => comment._id !== _id)
			return { ...curState, comments: newComments }
		})
	}

	return (
		<div className="flex mt-4 items-start pb-4">
			<Avatar username={author} />
			<div className="max-w-sm md:max-w-md ">
				<div className="flex items-center">
					<span className="font-bold text-sm">{author}</span>
					<span className="ml-2 text-sm text-gray-500">
						<FormattedRelativeTime value={dateDiff} numeric="auto" updateIntervalInSeconds={1} />
					</span>
					{author == user.username && (
						<div className="ml-4">
							<button onClick={handleDelete}>
								<AiOutlineDelete size="16" />
							</button>
						</div>
					)}
				</div>
				<div className="whitespace-pre-line text-sm">
					<Linkify tagName="p" options={{ truncate: 42 }}>
						{content}
					</Linkify>
				</div>
			</div>
		</div>
	)
}
export default Comment
