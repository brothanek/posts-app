import axios from 'axios'
import toast from 'react-hot-toast'
import { ArticleInputProps, ArticleProps } from 'types'

export const uploadImage = async (image: File) => {
	try {
		const body = new FormData()
		body.append('image', image)
		const { data } = await axios.post('/api/images/upload', body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		if (!data?.url) {
			toast.error('Image upload failed, please try again later')
			return
		}
		return { url: data.url, id: data.id }
	} catch (error) {
		console.log(error)
		toast.error('Image upload failed, please try again later')
	}
}

export const deleteComment = async (_id: string, articleId: string) => {
	try {
		await axios.delete(`/api/comments/${_id}`, { data: { articleId } })
		toast.success('Comment deleted')
	} catch (e: any) {
		toast.error(e.response.data.message)
	}
}

export const postComment = async (articleId: string, content: string) => {
	try {
		const { data } = await axios.post('/api/comments', { articleId, content })
		toast.success(data.message || 'Success')
		return data.comment
	} catch (e: any) {
		console.log(e)
		toast.error(e.response.data.message || 'Something went wrong')
	}
}

export const postArticle = async (inputs: ArticleInputProps) => {
	let imageId
	try {
		const cloudinary_img = await uploadImage(inputs.image as File)
		if (!cloudinary_img) return
		imageId = cloudinary_img.id

		const articleBody: ArticleProps = {
			...inputs,
			cloudinary_img,
			comments: [],
		}
		const { data } = await axios.post('/api/articles', articleBody)
		return data
	} catch (e) {
		if (imageId) await axios.delete(`/api/images/${imageId}`)
		toast.error('Something went wrong')
		console.log(e)
	}
}

export const updateArticle = async (inputs: ArticleInputProps, oldArticle: ArticleProps) => {
	try {
		const { data } = await axios.patch(`/api/articles/${oldArticle._id}`, inputs)
		//delete an old image
		if (inputs.cloudinary_img?.id && oldArticle.cloudinary_img?.id) {
			axios.delete(`/api/images/${oldArticle.cloudinary_img.id}`)
		}
		toast.success(data?.message || 'Successfully updated')
		return data.success
	} catch (e) {
		console.log(e)
		toast.error('Something went wrong')
	}
}

export const deleteArticle = async (articleId: string, imageId: string) => {
	try {
		const { data } = await axios.delete(`/api/articles/${articleId}`)

		toast.success(data.message || 'Article deleted')
		return data.success
	} catch (e) {
		console.log(e)
		toast.error('Something went wrong, please try again later')
	}
}
