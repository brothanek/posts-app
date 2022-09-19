import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export const usePagination = (config: { page: string; limit: string; sort: string }) => {
	const [page, setPage] = useState(Number(config.page))
	const [limit, setLimit] = useState(Number(config.limit))
	const [sort, setSort] = useState(config.sort as 'desc' | 'asc')

	const router = useRouter()

	useEffect(() => {
		if (!router?.isReady || !router?.query) return
		const { page, limit, sort } = router.query
		if (page) setPage(Number(page))
		if (limit) setLimit(Number(limit))
		if (sort) setSort(sort as 'desc' | 'asc')
	}, [router?.query, router?.isReady])

	useEffect(() => {
		if (!router?.isReady) return
		router.push({
			query: { page, limit, sort },
		})
	}, [page, limit, sort])

	const pagination = useMemo(
		() => ({ page, limit, sort, setPage, setLimit, setSort }),
		[page, limit, sort, setPage, setLimit, setSort],
	)
	return pagination
}
