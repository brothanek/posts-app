import axios from 'axios'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { requireAuthentication } from 'utils/requireAuth'
import { FormattedRelativeTime } from 'react-intl'
import AuthorAndDate from '@components/articles/AuthorAndDate'
import Layout from '@components/Layout'
import { Avatar } from '@components/Avatar'
import { RelatedArticles } from '@components/articles/RelatedArticles'

import type { Article, ArticleWithComments } from 'types'
import type { GetServerSideProps, NextPage } from 'next'

const Comment = ({ author = 'Ondra B.', content = 'Content', createdAt = '' }) => {
	const now = new Date().valueOf()
	const createdAtVal = new Date(createdAt).valueOf()
	const diff = (createdAtVal - now) / 1000

	return (
		<div className="flex mt-4">
			<Avatar />
			<div>
				<div className="flex items-center mb-2">
					<span className="font-bold text-sm">{author}</span>
					<span className="ml-2 text-sm text-gray-500">
						{/* TODO: fix incorrect time */}
						<FormattedRelativeTime value={diff} numeric="auto" updateIntervalInSeconds={1} />
					</span>
				</div>
				<p className="text-sm">{content}</p>
			</div>
		</div>
	)
}

const Comments = ({
	comments = [
		{
			articleId: 'urn:uuid:7ea83981-f223-f837-13d1-a29',
			author: 'Ondrej Brothanek',
			content: 'This article is on point and very inspirational.',
			commentId: '6da93300-3927-0520-79c6-e295ab749158',
			postedAt: '1993-03-05T21:00:13.692Z',
			score: 42,
		},
	],
	articleId = '',
}) => {
	const [content, setContent] = useState('')

	const postComment = async () => {
		const body = { content, articleId, author: 'Ondra' }
		console.log(body)

		try {
			const response = await axios.post('/api/comments', body)
			console.log(response)
		} catch (e) {
			console.log(e)
		}
	}
	const handleKey: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
		if (key == 'Enter' && content) {
			if (!window.confirm('Do you want to submit your comment?')) return
			postComment()
		}
	}
	const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
		setContent(value)
	}
	return (
		<div className="w-full mt-7 mb-4 items-center">
			<h2>{`Comments (${comments.length})`}</h2>
			<div className="flex pt-7">
				<Avatar /> <input value={content} onChange={handleChange} onKeyDown={handleKey} />
			</div>
			{comments.map(({ commentId, ...rest }) => (
				<Comment key={commentId} {...rest} />
			))}
		</div>
	)
}

const View: NextPage<ArticleWithComments> = (article) => {
	const {
		articleId = '',
		createdAt = '',
		author = 'Name',
		title = 'Not found',
		perex = 'Perex',
		content = '**content**',
		comments = [],
	} = article
	return (
		<Layout>
			<div className="flex mt-20">
				<div className="w-2/3 min-h-screen">
					<h1>{title}</h1>
					<AuthorAndDate className="mt-6" date={createdAt} author={author} />
					{/* Image dummy */}
					<div className="bg-gray-500 w-full h-72 mt-4" />

					<p className="my-8">{perex}</p>
					<ReactMarkdown>{content}</ReactMarkdown>
					<Comments comments={comments} articleId={articleId} />
				</div>
				<div className="w-1/3 ml-4 pl-6 border-l h-full">
					<h4>Related articles</h4>
					<RelatedArticles currentId={articleId} />
				</div>
			</div>
		</Layout>
	)
}

export default View

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (ctx) => {
	const id = ctx.query.id
	try {
		const response = await axios.get(`${process.env.API_URL}/articles/${id}`, {
			headers: { 'X-API-KEY': process.env.X_API_KEY! },
		})

		const article: Article = response?.data
		return {
			props: article,
		}
	} catch (e) {
		console.log(e)

		return {
			props: {},
		}
	}
})
