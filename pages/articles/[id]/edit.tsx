import { useRouter } from 'next/router'
import { requireAuthentication } from 'middleware/requireAuth'
import { getArticle } from 'pages/api/articles/[id]'
import ArticleForm from 'components/forms/ArticleForm'
import Layout from 'components/Layout'
import { updateArticle } from 'lib/calls'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleInputProps, ArticleProps } from 'types'

const Edit: NextPage<{ article: ArticleProps }> = ({ article }) => {
	const Router = useRouter()

	const handleEdit = async (inputs: ArticleInputProps) => {
		const res = (await updateArticle(inputs, article)) as { data: ArticleProps; success: boolean }
		if (res?.success) {
			Router.push('/dashboard')
		}
	}

	return (
		<Layout>
			<ArticleForm {...article} formTitle="Edit Article" submitCallback={handleEdit} />
		</Layout>
	)
}

export default Edit

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (ctx) => {
	const id = ctx.query.id

	const { username } = (ctx as any).user
	try {
		const article: ArticleProps = JSON.parse(JSON.stringify(await getArticle(id!)))

		return {
			props: { article, username },
		}
	} catch (e) {
		console.log(e)

		return {
			props: {},
		}
	}
})
