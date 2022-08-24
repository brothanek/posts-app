import React, { useState, useRef } from 'react'
import { Formik } from 'formik'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { Switch } from '@material-tailwind/react'
import { ImageHandler } from './ImageHandler'
import { ArticleProps } from 'types'
import { PatchInputProps } from '@pages/articles/[id]/edit'

export type ImageProps = File | string

interface FormProps {
	title?: string
	perex?: string
	content?: string
	cloudinary_img?: { url?: string; id?: string }
	formTitle?: string
	handleRequest?: (inputs: PatchInputProps) => Promise<void> | null
}

const uploadImage = async (image: string | File) => {
	// image will be string when only displaying already uploaded image
	if (typeof image === 'string') return
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
	return data
}

const ArticleForm: React.FC<FormProps> = ({
	title = '',
	perex = '',
	content = '',
	cloudinary_img = { url: '', id: '' },
	formTitle = 'Create new article',
	handleRequest = null,
}) => {
	const username = 'Ondra'
	const [image, setImage] = useState<ImageProps>(cloudinary_img?.url || '')
	const [markdown, setMarkdown] = useState(false)

	const toggleMarkdown = () => {
		setMarkdown((cur) => !cur)
	}

	const Router = useRouter()

	const handleSubmit = async (inputs: PatchInputProps, { setSubmitting }: any) => {
		if (handleRequest) {
			try {
				let body = inputs
				console.log({ image })

				if (image) {
					const { url, id } = await uploadImage(image)
					if (!url || !id) return toast.error('Image upload failed')
					body.cloudinary_img = { url, id }
				}
				await handleRequest(body)
			} catch (e) {
				console.log(e)
				toast.error('Something went wrong')
			}
		} else {
			if (!image) return
			try {
				const { url, id } = await uploadImage(image)
				if (!url || !id) return
				const articleBody: ArticleProps = {
					...inputs,
					cloudinary_img: { url, id },
					author: username,
				}
				const { data } = await axios.post('/api/articles', articleBody)

				Router.push('/dashboard')
				toast.success(data.message || 'Image successfully uploaded')
			} catch (e) {
				toast.error(JSON.stringify(e))
			} finally {
				setSubmitting(false)
			}
		}
	}

	const handleValidation = (values: { title: string; perex: string; content: string }) => {
		const errors: any = {}
		if (!values.title) {
			errors.title = 'Required'
		}
		if (!values.perex) {
			errors.perex = 'Required'
		}
		if (!values.content) {
			errors.content = 'Required'
		} else if (values.content?.length < 10) {
			errors.content = 'Content needs to have at least 10 characters'
		}
		if (!image) {
			errors.image = 'Required'
		}
		return errors
	}

	return (
		<Formik initialValues={{ title, perex, content }} validate={handleValidation} onSubmit={handleSubmit}>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
				return (
					<form className="w-full max-w-xl pt-20" onSubmit={handleSubmit}>
						<div className="w-full flex items-center sm:flex-row flex-col">
							<h1>{formTitle}</h1>
							<div>
								<button className="primary-btn mt-4 sm:mt-0 ml-10" type="submit" disabled={isSubmitting}>
									Publish article
								</button>
							</div>
						</div>

						<div className="mb-6 mt-10">
							<label>Article title</label>
							<input
								type="text"
								name="title"
								placeholder="Title"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.title}
							/>
							<p className="form-error">{touched.title && errors.title}</p>
						</div>
						<ImageHandler errors={errors} image={image} setImage={setImage} />

						<div className="mb-6">
							<label>Perex</label>
							<input
								type="text"
								name="perex"
								placeholder="Perex"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.perex}
							/>
							<p className="form-error">{touched.perex && errors.perex}</p>
						</div>
						<div className="mb-6">
							<div className="flex items-center">
								<label>Content</label>
								<label className="text-sm mr-4 ml-20"> Preview markdown:</label>
								<Switch checked={markdown} onChange={toggleMarkdown} />
							</div>
							<div className="h-56">
								{!markdown ? (
									<textarea
										className="shadow appearance-none rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
										name="content"
										placeholder="Type something..."
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.content}
									/>
								) : (
									<ReactMarkdown className="shadow appearance-none rounded h-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed">
										{values.content}
									</ReactMarkdown>
								)}
								<p className="form-error">{touched.content && errors.content}</p>
							</div>
						</div>
					</form>
				)
			}}
		</Formik>
	)
}
export default ArticleForm
