import Layout from '@components/Layout'
import { getArticle } from '@pages/api/articles/[id]'
import { RelatedArticles } from '@components/articles/RelatedArticles'
import Article from '@components/articles/Article'

import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps } from 'types'

const View: NextPage<ArticleProps> = (article) => {
	const { _id = '' } = article
	return (
		<Layout>
			<div className="flex mt-20">
				<div className="w-2/3 min-h-screen">
					<Article data={article} />
				</div>
				<div className="w-1/3 ml-4 pl-6 border-l h-full">
					<h4>Related articles</h4>
					<RelatedArticles currentId={_id} />
				</div>
			</div>
		</Layout>
	)
}

export default View

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const id = ctx.query.id
	try {
		const article: ArticleProps = JSON.parse(JSON.stringify(await getArticle(id!)))

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
