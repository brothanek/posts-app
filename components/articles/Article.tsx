import React, { useState } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import AuthorAndDate from './AuthorAndDate'
import { Comments } from './comments/Comments'
import type { ArticleProps } from 'types'

const Article = ({ data }: { data: ArticleProps }) => {
	const [imageLoad, setImageLoad] = useState({ loading: true, error: false })
	const { _id, createdAt, author = '', title = '', perex = '', content = '', comments = [], cloudinary_img } = data

	const imageLoaded = () => {
		setImageLoad({ loading: false, error: false })
	}
	return (
		<div className="w-full">
			<h1>{title}</h1>
			<p className="text-xl mt-1">{perex}</p>
			<AuthorAndDate className="mt-4" date={createdAt} author={author} />

			{cloudinary_img?.url && (
				<div className="my-4">
					<div style={{ display: !imageLoad.error ? 'block' : 'none' }}>
						<Image
							onError={() => setImageLoad({ loading: false, error: true })}
							onLoad={imageLoaded}
							width={140}
							height={100}
							layout="responsive"
							objectFit="cover"
							placeholder="blur"
							blurDataURL="/blur-placeholder.jpeg"
							src={cloudinary_img?.url}
							alt="article image"
						/>
					</div>
					{imageLoad.loading && <div className="text-center">Image loading...</div>}
				</div>
			)}

			<ReactMarkdown className="text-lg mt-10">{content}</ReactMarkdown>
			<Comments comments={comments} articleId={_id || ''} />
		</div>
	)
}

export default Article
