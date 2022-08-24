import { getArticles } from './api/articles'
import Layout from '@components/Layout'

import type { NextPage } from 'next'
import type { ArticleProps } from 'types'
import Image from 'next/image'
import { ArticlePreview } from '@components/articles/ArticlePreview'

const Home: NextPage<{ articles: ArticleProps[] }> = ({ articles = [] }) => {
	return (
		<Layout>
			<h1 className="pt-20 mb-10">Recent articles</h1>
			{articles.map((article) => {
				return <ArticlePreview key={article._id} {...article} />
			})}
		</Layout>
	)
}

export default Home

export async function getStaticProps() {
	try {
		const articles: ArticleProps[] = JSON.parse(JSON.stringify(await getArticles()))
		return {
			props: { articles }, // will be passed to the page component as props
		}
	} catch (e) {
		console.log(e)
		return {
			props: {},
		}
	}
}
