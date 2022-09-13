import Image from 'next/image'
import WithLink from '@components/WithLink'
import AuthorAndDate from '@components/articles/AuthorAndDate'
import type { ArticleProps } from 'types'

export const ArticlePreview = ({
	_id = '',
	title = '',
	perex = '',
	cloudinary_img = { url: undefined },
	createdAt,
	author = '',
}: ArticleProps) => {
	const href = `articles/${_id}/view`
	return (
		<div className="card lg:card-side bg-base-100 shadow-xl mb-8">
			<WithLink href={href}>
				<div className="w-96">
					{cloudinary_img.url && (
						<Image
							src={cloudinary_img.url}
							height={100}
							width={140}
							alt="article image"
							placeholder="blur"
							blurDataURL="/blur-placeholder.jpeg"
							layout="responsive"
							objectFit="cover"
						/>
					)}
				</div>
			</WithLink>

			<div className="card-body w-96">
				<AuthorAndDate date={createdAt} author={author} />
				<div className="h-full">
					<h2 className="card-title line-clamp-2">{title}</h2>
					<p className="line-clamp-3">{perex}</p>
				</div>

				<div className="card-actions lg:justify-end">
					<WithLink href={href} className="btn btn-xs">
						Read article
					</WithLink>
				</div>
			</div>
		</div>
	)
}
