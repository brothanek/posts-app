import ArticleForm from '@components/forms/ArticleForm'
import Layout from '@components/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { requireAuthentication } from 'api-lib/middleware/requireAuth'

import type { ArticleProps } from 'types'
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { getArticle } from '@pages/api/articles/[id]'

export interface PatchInputProps {
	perex: string
	title: string
	content: string
	cloudinary_img?: { url: string | undefined; id: string | undefined }
}

const Edit: NextPage<ArticleProps> = (article) => {
	const Router = useRouter()
	const patchArticle = async (inputs: PatchInputProps) => {
		try {
			const { data } = await axios.patch(`/api/articles/${article._id}`, inputs)
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
})
