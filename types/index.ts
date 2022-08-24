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
	comments?: CommentProps[]
}
export type ArticleKey = keyof ArticleProps

export interface CommentProps {
	_id: string
	articleId: string
	author: string
	content: string
	createdAt: string
}
