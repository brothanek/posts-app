import ArticleForm from '@components/forms/ArticleForm'
import Layout from '@components/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { requireAuthentication } from 'utils/requireAuth'

import type { Article } from 'types'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

const Edit: NextPage<{ article: Article }> = ({ article }) => {
	const Router = useRouter()
	const patchArticle = async (inputs: { perex: string; title: string; content: string }) => {
		try {
			const { data } = await axios.patch(`/api/articles/${article.articleId}`, inputs)
			Router.push('/dashboard')
			toast.success(data?.message)
		} catch (e) {
			console.log(e)
			toast.error('Something went wrong')
		}
	}
	return (
		<Layout>
			<ArticleForm {...article} formTitle="Edit Article" handleRequest={patchArticle} />
		</Layout>
	)
}

export default Edit

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (ctx) => {
	const id = ctx.query.id
	try {
		const response = await axios.get(`${process.env.API_URL}/articles/${id}`, {
			headers: { 'X-API-KEY': process.env.X_API_KEY! },
		})
		const article: Article = response?.data || {}
		return {
			props: { article },
		}
	} catch (e) {
		console.log(e)

		return {
			props: {},
		}
	}
})
