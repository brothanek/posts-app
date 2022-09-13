import Image from 'next/image'
import { useRef, useMemo } from 'react'
import { ImageProps } from './forms/ArticleForm'

export const ImageHandler = ({
	image,
	setImage,
	className,
}: {
	image: ImageProps
	setImage: React.Dispatch<React.SetStateAction<ImageProps>>
	className?: string
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

	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		if (inputRef.current) (inputRef.current as any).click()
	}

	return (
		<div className={`${className}`}>
			<label>Featured image *</label>
			<input
				ref={inputRef}
				type="file"
				name="image"
				className="hidden"
				accept="image/png, image/jpeg"
				onChange={handleFileInputChange}
			/>
			<button onClick={handleClick} className="btn btn-sm">
				Choose an image
			</button>
			{image && url && (
				<div className="w-80 mt-2">
					<Image height={100} width={100} layout="responsive" objectFit="cover" src={url} alt="not found" />
				</div>
			)}
		</div>
	)
}
