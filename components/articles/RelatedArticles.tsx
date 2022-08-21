import axios from 'axios'
import useSWR from 'swr'
import WithLink from '@components/WithLink'
import type { Article } from 'types'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const RelatedArticles = ({ currentId = '' }) => {
	const { data: articles, error } = useSWR<Article[]>('/api/articles', fetcher)

	if (error) return <p className="form-error">Something went wrong</p>
	if (!articles) return <p>Loading...</p>

	return (
		<div>
			{articles
				.filter(({ articleId }) => articleId !== currentId)
				.map(({ title, articleId, perex }) => {
					return (
						<WithLink key={articleId} href={`/articles/${articleId}/view`}>
							<div className="mt-4 px-2 hover:bg-gray-100 cursor-pointer">
								<p className="font-bold">{title}</p>
								<p>{perex}</p>
							</div>
						</WithLink>
					)
				})}
		</div>
	)
}
