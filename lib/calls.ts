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
	return await toast.promise(axios.delete(`/api/comments/${_id}`, { data: { articleId } }), {
		loading: 'Deleting comment...',
		success: 'Comment deleted',
		error: (err) => {
			console.log(err)
			return 'Something went wrong'
		},
	})
}

export const postComment = async (articleId: string, content: string) => {
	return await toast.promise(axios.post('/api/comments', { articleId, content }), {
		loading: 'Posting...',
		success: 'Comment posted',
		error: 'Something went wrong',
	})
}

export const postArticle = async (inputs: ArticleInputProps) => {
	return await toast.promise(
		new Promise(async (resolve, reject) => {
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
				resolve(data)
				return data
			} catch (e) {
				if (imageId) await axios.delete(`/api/images/${imageId}`)
				reject(e)
				console.log(e)
			}
		}),
		{
			loading: 'Posting...',
			success: 'Article posted',
			error: 'Something went wrong',
		},
	)
}

export const updateArticle = async (inputs: ArticleInputProps, article: ArticleProps) => {
	return await toast.promise(
		new Promise(async (resolve, reject) => {
			try {
				let body = inputs
				if (typeof inputs.image !== 'string') {
					//if image is not a string, it's a file
					const cloudinary_img = await uploadImage(inputs.image)
					body = { ...inputs, cloudinary_img }
				}
				resolve(await axios.patch(`/api/articles/${article._id}`, { ...body, oldImageId: article.cloudinary_img?.id }))
			} catch (e) {
				reject(e)
			}
		}),
		{
			loading: 'Updating...',
			success: 'Article updated',
			error: 'Something went wrong',
		},
	)
}

export const deleteArticle = async (articleId: string) => {
	return await toast.promise(axios.delete(`/api/articles/${articleId}`), {
		loading: 'Deleting article...',
		success: 'Article deleted',
		error: 'Something went wrong',
	})
}
