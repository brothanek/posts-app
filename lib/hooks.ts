import _ from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const usePagination = (config: { page: string; limit: string; sort: string }) => {
	const [page, setPage] = useState(config.page)
	const [limit, setLimit] = useState(config.limit)
	const [sort, setSort] = useState(config.sort as 'desc' | 'asc')

	const router = useRouter()

	useEffect(() => {
		if (!router?.isReady || !router?.query) return
		const { page, limit, sort } = router.query
		if (page) setPage(page + '')
		if (limit) setLimit(limit + '')
		if (sort) setSort(sort as 'desc' | 'asc')
	}, [router?.query, router?.isReady])

	useEffect(() => {
		if (!router?.isReady) return
		if (_.isEqual(config, { page, limit, sort })) return
		const query = { ...router.query, page, limit, sort }
		router.push({
			query,
		})
	}, [page, limit, sort])

	const pagination = { page: Number(page), limit: Number(limit), sort, setPage, setLimit, setSort }

	return pagination
}
