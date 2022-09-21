import type { NextApiRequest } from 'next'

export type ImageProps = File | string

export interface SignUpProps {
	username: string
	password: string
	confirmPassword: string
}

export interface SignInProps {
	username: string
	password: string
}

export interface ArticleProps {
	_id?: string
	author?: string
	privateDoc: boolean
	title: string
	content: string
	perex: string
	cloudinary_img?: { url?: string; id?: string }
	updatedAt?: string
	createdAt?: string
	comments: CommentProps[]
}
export interface ArticleInputProps {
	privateDoc: boolean
	perex: string
	title: string
	content: string
	image: ImageProps
	cloudinary_img?: { url: string | undefined; id: string | undefined }
}
export type ArticleKey = keyof ArticleProps

export interface PaginatedArticles {
	docs: ArticleProps[]
	totalDocs: number
	limit: number
	page: number
	totalPages: number
	pagingCounter: number
	hasPrevPage: boolean
	hasNextPage: boolean
}

export interface CommentProps {
	_id: string
	articleId: string
	author: string
	content: string
	createdAt: string
}
export interface User {
	username: string
	password: string
	createdAt: Date
}

export interface NextApiRequestWithUser extends NextApiRequest {
	user: { username: string; id: string }
	login: any
	logOut: any
	session: any
}
