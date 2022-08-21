import axios from 'axios'
import Link from 'next/link'
import AuthorAndDate from '@components/articles/AuthorAndDate'
import Layout from '@components/Layout'
import type { Article } from 'types'
import type { NextPage } from 'next'

const ArticlePreview = ({ articleId, title, perex, imageId, createdAt, author }: Article) => {
	return (
		<div className="flex">
			{/* Image mock */}
			<div className="w-52 h-52 bg-gray-500 mr-5 mb-5" />

			<div>
				<h2 className="text-2xl">{title}</h2>
				<AuthorAndDate date={createdAt} author={author} />
				<p>{perex}</p>
				<Link href={`articles/${articleId}/view`}>
					<a className="text-blue-500 text-sm">Read whole article</a>
				</Link>
			</div>
		</div>
	)
}

const Home: NextPage<{ articles: Article[] }> = ({ articles = [] }) => {
	console.log(articles)

	return (
		<Layout>
			<h1 className="pt-20 mb-10">Recent articles</h1>
			{articles.map((article) => {
				return <ArticlePreview key={article.articleId} {...article} />
			})}
		</Layout>
	)
}

export default Home

export async function getStaticProps() {
	const response = await axios.get(`${process.env.API_URL}/articles`, {
		headers: { 'X-API-KEY': process.env.X_API_KEY! },
	})

	const { items } = response?.data || {}

	const articles: Article[] = items || []
	return {
		props: { articles }, // will be passed to the page component as props
	}
}
