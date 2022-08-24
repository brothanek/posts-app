import Image from 'next/image'
import { useRef, useMemo } from 'react'
import { ImageProps } from './ArticleForm'

export const ImageHandler = ({
	image,
	setImage,
	errors,
}: {
	image: ImageProps
	setImage: React.Dispatch<React.SetStateAction<ImageProps>>
	errors: any
}) => {
	const inputRef = useRef(null)
	const url = useMemo(() => {
		if (typeof image === 'string') return image
		return image && URL.createObjectURL(image)
	}, [image])

	const handleFileInputChange = async ({ target }: React.FormEvent<HTMLInputElement>) => {
		if (!target) return
		const imageData = (target as any).files[0]
		setImage(imageData)
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
				onChange={handleFileInputChange}
			/>
			<button onClick={handleClick} className="rounded bg-gray-600 hover:bg-gray-700 text-white px-2 py-0.5">
				Upload an image
			</button>
			<p className="form-error mb-2">{errors.image}</p>
			{image && url && (
				<div className="w-80">
					<Image height={1} width={1} layout="responsive" objectFit="cover" src={url} alt="not found" />
				</div>
			)}
		</>
	)
}
