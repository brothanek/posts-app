import Layout from 'components/Layout'
import { getArticle } from 'pages/api/articles/[id]'
import { RelatedArticles } from 'components/articles/RelatedArticles'
import Article from 'components/articles/Article'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps } from 'types'

const View: NextPage<ArticleProps> = (article) => {
	const { _id = '' } = article
	if (!_id)
		return (
			<Layout>
				<h1>Article not found</h1>
			</Layout>
		)

	return (
		<Layout>
			<div className="flex flex-col lg:flex-row transition-all pt-8">
				<Article data={article} />
				<div className="divider divider-vertical lg:divider-horizontal" />
				<RelatedArticles currentId={_id} />
			</div>
		</Layout>
	)
}

export default View

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const id = ctx.query.id
	try {
		const article: ArticleProps = JSON.parse(JSON.stringify(await getArticle(id!)))
		console.log(article)

		return {
			props: article,
		}
	} catch (e) {
		console.log(e)

		return {
			props: {},
		}
	}
}
