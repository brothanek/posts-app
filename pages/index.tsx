import { SWRConfig } from 'swr'
import { NextPage } from 'next'
import Layout from 'components/Layout'
import { getPaginatedArticles } from './api/articles'
import { ArticleList } from '@components/articles/ArticleList'
import type { PaginatedArticles } from 'types'

const apiUrl = '/api/articles/'
const articlesConfig = { page: '1', limit: '8', sort: { createdAt: 'desc' } }

const Home: NextPage<{ fallback?: PaginatedArticles }> = ({ fallback = {} }) => {
	return (
		<Layout>
			<h1 className="pt-20 mb-10 text-center md:text-start">Recent articles</h1>
			<SWRConfig value={{ fallback }}>
				<ArticleList articlesConfig={articlesConfig} apiUrl={apiUrl} />
			</SWRConfig>
		</Layout>
	)
}

export default Home

export async function getStaticProps() {
	try {
		const articles: PaginatedArticles = JSON.parse(JSON.stringify(await getPaginatedArticles(articlesConfig)))
		const { limit, page, sort } = articlesConfig
		return {
			props: {
				fallback: {
					[`${apiUrl}?limit=${limit}&page=${page}&sort=${sort.createdAt}`]: articles,
				},
			},
		}
	} catch (e) {
		console.log(e)
		return {
			props: {},
		}
	}
}
