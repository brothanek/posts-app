import useSWR from 'swr'
import { ArticlePreview } from 'components/articles/ArticlePreview'
import { usePagination } from 'lib/hooks'
import { LoaderIcon } from 'react-hot-toast'
import { fetcher } from 'lib/utils'
import type { PaginatedArticles } from 'types'
import { useMemo } from 'react'

export const ArticleList = ({
	apiUrl = '',
	articlesConfig = { page: '1', limit: '8', sort: { createdAt: 'desc' } },
}) => {
	const limitOptions = [2, 4, 8, 16]
	const { limit, setLimit, page, setPage, sort, setSort } = usePagination({
		...articlesConfig,
		sort: articlesConfig.sort.createdAt,
	})

	const url = useMemo(() => {
		return `${apiUrl}?limit=${limit}&page=${page}&sort=${sort}`
	}, [limit, page, sort, apiUrl])

	const { data, error } = useSWR<PaginatedArticles>(url, fetcher)
	const loading = !data
	const maxPage = data?.totalPages || 1

	const handlePageChange = (nextPage: number) => {
		let index = nextPage
		if (nextPage < 1) index = 1
		if (nextPage > maxPage) index = maxPage
		setPage(index)
	}

	const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = Number(event.target.value)
		setLimit(value)
	}

	if (error) return <p className="text-red-500">Something went wrong, please try again later</p>

	return (
		<div className="flex flex-col items-center md:items-start">
			<div>
				<div className="flex items-center w-full mb-4">
					<div className="flex justify-center">
						{/* Pagination */}
						<div className="btn-group items-center">
							<button onClick={() => handlePageChange(page - 1)} className="btn btn-sm" disabled={page == 1}>
								«
							</button>
							<div className="px-2">{`${page} of ${maxPage}`}</div>
							<button onClick={() => handlePageChange(page + 1)} className="btn btn-sm" disabled={page == maxPage}>
								»
							</button>
						</div>
						{/* Sort by */}
						<div className="btn-group ml-4">
							<button onClick={() => setSort('desc')} className={`btn btn-sm ${sort == 'desc' && 'btn-active'}`}>
								Newest
							</button>
							<button onClick={() => setSort('asc')} className={`btn btn-sm ${sort == 'asc' && 'btn-active'}`}>
								Oldest
							</button>
						</div>
					</div>
				</div>
			</div>
			<div>
				{loading ? (
					<div className="flex items-center">
						<span>Loading</span>
						<LoaderIcon className="ml-2" />
					</div>
				) : (
					(data?.docs || []).map((article) => {
						return <ArticlePreview key={article._id} {...article} />
					})
				)}
			</div>
			{/* Items per page */}
			<div className="flex items-center pb-4">
				<select value={limit} onChange={handleLimitChange} className="select select-sm mr-2">
					{limitOptions.map((num) => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
				<label>items per page</label>
			</div>
		</div>
	)
}
