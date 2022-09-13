import React, { useState } from 'react'
import { Formik, FormikHelpers } from 'formik'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { uploadImage } from 'lib/calls'
import { ImageHandler } from '../ImageHandler'
import type { ArticleProps } from 'types'
import type { PatchInputProps } from 'pages/articles/[id]/edit'

export type ImageProps = File | string

interface FormProps {
	author?: string
	title?: string
	perex?: string
	content?: string
	cloudinary_img?: { url?: string; id?: string }
	formTitle?: string
	submitCallback?: (inputs: PatchInputProps) => Promise<void> | null
}

const handleImageUpload = async (image: ImageProps) => {
	if (typeof image === 'string') return

	const { url, id } = (await uploadImage(image)) || { url: '', id: '' }
	if (!url || !id) {
		toast.error('Image upload failed')
		return
	}
	return { url, id } as { url: string; id: string }
}

const ArticleForm: React.FC<FormProps> = ({
	author = '',
	title = '',
	perex = '',
	content = '',
	cloudinary_img = { url: '', id: '' },
	formTitle = 'Create new article',
	submitCallback = null,
}) => {
	const [image, setImage] = useState<ImageProps>(cloudinary_img?.url || '')
	const [markdown, setMarkdown] = useState(false)

	const toggleMarkdown = () => {
		setMarkdown((cur) => !cur)
	}

	const Router = useRouter()

	const handleSubmit = async (
		inputs: PatchInputProps,
		{ setSubmitting, setFieldError }: FormikHelpers<PatchInputProps>,
	) => {
		if (submitCallback) {
			try {
				let body = inputs
				if (image) {
					body.cloudinary_img = await handleImageUpload(image)
					await submitCallback(body)
				} else {
					return setFieldError('image', 'Image is required')
				}
			} catch (e) {
				console.log(e)
				toast.error('Something went wrong')
			}
		} else {
			if (!image) return setFieldError('image', 'Image is required')
			let imageId
			try {
				const cloudinary_img = await handleImageUpload(image)
				if (!cloudinary_img) return
				imageId = cloudinary_img.id
				const articleBody: ArticleProps = {
					...inputs,
					cloudinary_img,
					author,
					comments: [],
				}
				const { data } = await axios.post('/api/articles', articleBody)

				Router.push('/dashboard')
				toast.success(data.message || 'Article successfully uploaded')
			} catch (e) {
				toast.error('Something went wrong')
				await axios.delete(`/api/images/${imageId}`)
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
		if (values.title.length > 80) {
			errors.title = 'Title must be less than 80 characters'
		}
		if (values.perex.length > 200) {
			errors.perex = 'Perex must be less than 200 characters'
		}
		if (values.content.length > 3000) {
			errors.content = 'Perex must be less than 3000 characters'
		}

		if (!values.content) {
			errors.content = 'Required'
		}
		return errors
	}

	return (
		<Formik initialValues={{ title, perex, content }} validate={handleValidation} onSubmit={handleSubmit}>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
				const titleError = touched.title && errors.title
				return (
					<form className="w-full max-w-xl m-auto mt-20" onSubmit={handleSubmit}>
						<div className="w-full flex items-center md:items-start flex-col">
							<h1>{formTitle}</h1>
						</div>

						<div className="mb-6 mt-10">
							<label>Article title *</label>
							<input
								className={`input input-bordered w-full ${titleError && 'input-error'}`}
								type="text"
								name="title"
								placeholder="Title"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.title}
							/>
							<p className="form-error">{titleError}</p>
						</div>
						<div className="mb-6">
							<ImageHandler image={image} setImage={setImage} />
							<p className="form-error">{(errors as any).image}</p>
						</div>

						<div className="mb-6">
							<label>Perex</label>
							<input
								className="input input-bordered w-full"
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
								<label>Content *</label>
								<label className="mr-4 ml-20"> Preview markdown:</label>
								<input type="checkbox" className="toggle -mt-2" checked={markdown} onChange={toggleMarkdown} />
							</div>
							<div className="h-56 mt-2">
								{!markdown ? (
									<textarea
										className="textarea textarea-bordered resize-none w-full h-full"
										name="content"
										placeholder="Type something..."
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.content}
									/>
								) : (
									<ReactMarkdown className="shadow appearance-none rounded h-full w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-not-allowed overflow-scroll">
										{values.content}
									</ReactMarkdown>
								)}
								<p className="form-error">{touched.content && errors.content}</p>
							</div>
							<div className="flex justify-end">
								<button className="btn bg-blue-500 mt-2" type="submit" disabled={isSubmitting}>
									{!isSubmitting ? 'Submit' : 'Loading...'}
								</button>
							</div>
						</div>
					</form>
				)
			}}
		</Formik>
	)
}
export default ArticleForm
