import { NextPage } from 'next'
import { getArticles } from './api/articles'
import Layout from '@components/Layout'
import { ArticlePreview } from '@components/articles/ArticlePreview'
import type { ArticleProps } from 'types'

const ArticleList = ({ articles }: { articles: ArticleProps[] }) => {
	return (
		<div className="flex flex-col items-center md:items-start">
			{articles.map((article) => {
				return <ArticlePreview key={article._id} {...article} />
			})}
		</div>
	)
}

const Home: NextPage<{ articles: ArticleProps[] }> = ({ articles = [] }) => {
	return (
		<Layout>
			<h1 className="pt-20 mb-10 text-center md:text-start">Recent articles</h1>
			<ArticleList articles={articles} />
		</Layout>
	)
}

export default Home

export async function getStaticProps() {
	try {
		const articles: ArticleProps[] = JSON.parse(JSON.stringify(await getArticles()))
		return {
			props: { articles }, // will be passed to the page component as props
			revalidate: 10, // 10 seconds
		}
	} catch (e) {
		console.log(e)
		return {
			props: {},
		}
	}
}
