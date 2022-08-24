import WithLink from '@components/WithLink'
import AuthorAndDate from '@components/articles/AuthorAndDate'
import Image from 'next/image'
import { ArticleProps } from 'types'

export const ArticlePreview = ({
	_id,
	title,
	perex,
	cloudinary_img = { url: undefined },
	createdAt,
	author,
}: ArticleProps) => {
	const href = `articles/${_id}/view`
	return (
		<div className="flex flex-col-reverse md:flex-row items-center md:items-start">
			<WithLink href={href}>
				<div className="w-72 mr-5 mb-5">
					{cloudinary_img.url && (
						<Image
							src={cloudinary_img.url}
							height={1}
							width={1.4}
							alt="article image"
							placeholder="blur"
							blurDataURL="/blur-placeholder.jpeg"
							layout="responsive"
							objectFit="cover"
						/>
					)}
				</div>
			</WithLink>

			<div className="mb-2 max-w-xs">
				<h2 className="text-2xl truncate">{title}</h2>
				<AuthorAndDate date={createdAt} author={author} />
				<p className="truncate">{perex}</p>
				<WithLink href={href} className="text-blue-500 text-sm">
					Read whole article
				</WithLink>
			</div>
		</div>
	)
}
