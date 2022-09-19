import useSWR from 'swr'
import { LoaderIcon } from 'react-hot-toast'
import WithLink from 'components/WithLink'
import { fetcher } from 'lib/utils'
import type { ArticleProps } from 'types'

const Message = ({ error }: { error?: string }) => {
	if (error) return <p className="text-red-500">Something went wrong</p>
	return <LoaderIcon />
}

export const RelatedArticles = ({ currentId = '' }) => {
	const { data, error } = useSWR<ArticleProps[]>('/api/articles', fetcher)

	return (
		<div className="lg:w-1/3 w-full h-full pb-8">
			<h4>Related articles</h4>
			<div className="mt-8">
				{data ? (
					<div>
						{data
							.filter(({ _id }) => _id !== currentId)
							.map(({ title, _id, perex }) => {
								return (
									<WithLink key={_id} href={`/articles/${_id}/view`}>
										<div className="mt-4 hover:bg-gray-100 cursor-pointer overflow-scroll">
											<p className="line-clamp-2 text-xl font-light tracking-wide mb-1">{title}</p>
											<p className="line-clamp-2">{perex}</p>
										</div>
									</WithLink>
								)
							})}
					</div>
				) : (
					<Message error={error} />
				)}
			</div>
		</div>
	)
}
