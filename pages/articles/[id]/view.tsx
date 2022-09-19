import Layout from 'components/Layout'
import { getArticle } from 'pages/api/articles/[id]'
import { RelatedArticles } from 'components/articles/RelatedArticles'
import Article from 'components/articles/Article'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps } from 'types'
import { parseCookies } from 'lib/session'
import { getLoginSession } from 'lib/auth'

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
	const req = ctx.req as any
	let user
	try {
		const cookies = parseCookies(req)
		if (cookies.session) {
			user = (await getLoginSession(cookies.session))?.passport?.user
		}
		const article: ArticleProps = JSON.parse(JSON.stringify(await getArticle(id!)))
		const { author, privateDoc } = article

		if ((privateDoc && !user) || (privateDoc && user.username !== author)) {
			return {
				redirect: {
					permanent: false,
					destination: '/auth',
				},
			}
		}
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
