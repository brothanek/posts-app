import Image from 'next/image'
import { useMemo, forwardRef } from 'react'
import { ImageProps } from 'types'

const Handler = (
	{
		image,
		children,
	}: {
		image: ImageProps
		children?: React.ReactNode
	},
	ref: any,
) => {
	const url = useMemo(() => {
		if (typeof image === 'string') return image
		return image && URL.createObjectURL(image)
	}, [image])

	const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		if (ref.current) ref.current.click()
	}

	return (
		<div>
			{children}
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
export const ImageHandler = forwardRef(Handler)
