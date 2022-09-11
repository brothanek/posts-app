import type { NextApiRequest } from 'next'

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
	author: string
	title: string
	content: string
	perex: string
	cloudinary_img?: { url?: string; id?: string }
	updatedAt?: string
	createdAt?: string
	comments: CommentProps[]
}
export type ArticleKey = keyof ArticleProps

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
