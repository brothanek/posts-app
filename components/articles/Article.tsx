import React, { useState } from 'react'
import Image from 'next/image'
import AuthorAndDate from './AuthorAndDate'
import ReactMarkdown from 'react-markdown'
import { ArticleProps } from 'types'
import { Comments } from './Comments'

const Article = ({ data }: { data: ArticleProps }) => {
	const [imgErr, setImgErr] = useState(false)
	const {
		_id,
		createdAt,
		author = 'Name',
		title = 'Not found',
		perex = 'Perex',
		content = '**Content**',
		comments = [],
		imageUrl,
	} = data

	const toggleError = () => {
		setImgErr((cur) => !cur)
	}

	return (
		<div>
			<h1>{title}</h1>
			<AuthorAndDate className="mt-6" date={createdAt} author={author} />

			<div style={{ display: !imgErr ? 'block' : 'none' }}>
				<Image
					onError={() => setImgErr(true)}
					onLoad={() => setImgErr(false)}
					width={400}
					height={200}
					layout="responsive"
					objectFit="cover"
					src={imageUrl || '/none'}
					alt="article image"
				/>
			</div>

			<p className="my-8">{perex}</p>
			<ReactMarkdown>{content}</ReactMarkdown>
			<Comments comments={comments} articleId={_id} />
		</div>
	)
}

export default Article
