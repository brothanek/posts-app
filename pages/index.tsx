import { getArticles } from './api/articles'
import AuthorAndDate from '@components/articles/AuthorAndDate'
import Layout from '@components/Layout'
import WithLink from '@components/WithLink'

import type { NextPage } from 'next'
import type { ArticleProps } from 'types'
import Image from 'next/image'

const ArticlePreview = ({ _id, title, perex, imageUrl, createdAt, author }: ArticleProps) => {
	const href = `articles/${_id}/view`
	return (
		<div className="flex flex-col-reverse md:flex-row">
			<WithLink href={href}>
				<div className="w-72 mr-5 mb-5">
					<Image
						src={imageUrl || '/none'}
						height={1}
						width={1.4}
						alt="article image"
						placeholder="blur"
						blurDataURL="/blur-placeholder.jpeg"
						layout="responsive"
						objectFit="cover"
					/>
				</div>
			</WithLink>

			<div className="mb-2">
				<h2 className="text-2xl">{title}</h2>
				<AuthorAndDate date={createdAt} author={author} />
				<p className="truncate max-w-xs">{perex}</p>
				<WithLink href={href} className="text-blue-500 text-sm">
					Read whole article
				</WithLink>
			</div>
		</div>
	)
}

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
