import React, { useState, useRef } from 'react'
import { Formik } from 'formik'
import axios from 'axios'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { Switch } from '@material-tailwind/react'

const ImageHandler = ({
	image,
	setImage,
	errors,
	touched,
}: {
	image: File | null
	setImage: (image: File) => void
	errors: any
	touched: any
}) => {
	const inputRef = useRef(null)
	const url = useMemo(() => image && URL.createObjectURL(image), [image])

	const handleFileInputChange = ({ target }: React.FormEvent<HTMLInputElement>) => {
		if (!target) return
		const img = (target as any).files[0]
		setImage(img)
	}

	const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!inputRef.current) return
		;(inputRef.current as any).click()
	}

	return (
		<>
			<label>Featured image</label>
			<input
				ref={inputRef}
				type="file"
				name="image"
				className="hidden"
				accept="image/png, image/jpeg"
				multiple
				onChange={handleFileInputChange}
			/>
			<button onClick={handleClick} className="rounded bg-gray-600 hover:bg-gray-700 text-white px-2 py-0.5">
				Upload an image
			</button>
			<p className="form-error mb-2">{touched.perex && errors.image}</p>
			{image && url && (
				<div>
					<Image alt="not found" width={'200px'} height={'200px'} src={url} />
				</div>
			)}
		</>
	)
}

interface ValuesType {
	title?: string
	perex?: string
	content?: string
	formTitle?: string
	handleRequest?: (inputs: { perex: string; title: string; content: string }) => Promise<void> | null
}

const ArticleForm: React.FC<ValuesType> = ({
	title = '',
	perex = '',
	content = '',
	formTitle = 'Create new article',
	handleRequest = null,
}) => {
	const [image, setImage] = useState<File | null>(null)
	const [markdown, setMarkdown] = useState(false)

	const toggleMarkdown = () => {
		setMarkdown((cur) => !cur)
	}

	const Router = useRouter()

	const handleSubmit = async (inputs: { perex: string; title: string; content: string }, { setSubmitting }: any) => {
		if (handleRequest) {
			await handleRequest(inputs)
		} else {
			if (image) {
				const body = new FormData()
				const blob = new Blob([JSON.stringify(inputs)], {
					type: 'application/json',
				})
				body.append('image', image)
				body.append('inputs', blob)

				try {
					const { status, data } = await axios.post('/api/articles', body, {
						headers: {
							'Content-Type': 'multipart/form-data',
							Accept: 'multipart/form-data',
						},
					})

					Router.push('/dashboard')
					toast.success(data.message)
				} catch (e) {
					toast.error(JSON.stringify(e))
				} finally {
					setSubmitting(false)
				}
			}
		}
	}

	const handleValidation = (values: ValuesType) => {
		const errors: any = {}
		if (!values.title) {
			errors.title = 'Required'
		}
		if (!values.perex) {
			errors.perex = 'Required'
		}
		if (!values.content) {
			errors.content = 'Required'
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
					<form className="w-2/3 pt-20" onSubmit={handleSubmit}>
						<div className="flex items-center">
							<h1>{formTitle}</h1>
							<div>
								<button
									className="ml-10 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline"
									type="submit"
									disabled={isSubmitting}
								>
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
						<ImageHandler errors={errors} touched={touched} image={image} setImage={setImage} />

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
