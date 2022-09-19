import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { requireAuthentication } from 'middleware/requireAuth'
import { getArticle } from 'pages/api/articles/[id]'
import ArticleForm from 'components/forms/ArticleForm'
import Layout from 'components/Layout'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps } from 'types'

export interface PatchInputProps {
	privateDoc: boolean
	perex: string
	title: string
	content: string
	image?: string
	cloudinary_img?: { url: string | undefined; id: string | undefined }
}

const Edit: NextPage<{ article: ArticleProps; username: string }> = ({ article, username }) => {
	const Router = useRouter()
	const patchArticle = async (inputs: PatchInputProps) => {
		try {
			const { data } = await axios.patch(`/api/articles/${article._id}`, { ...inputs, author: username })
			//delete an old image
			if (inputs.cloudinary_img?.id && article.cloudinary_img?.id) {
				axios.delete(`/api/images/${article.cloudinary_img.id}`)
			}
			Router.push('/dashboard')
			toast.success(data?.message || 'Successfully updated')
		} catch (e) {
			console.log(e)
			toast.error('Something went wrong')
		}
	}
	return (
		<Layout>
			<ArticleForm {...article} formTitle="Edit Article" submitCallback={patchArticle} />
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
