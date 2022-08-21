export interface SignUpProps {
	username: string
	password: string
	confirmPassword: string
}

export interface SignInProps {
	username: string
	password: string
}

export interface Article {
	articleId: string
	author: string
	title: string
	content: string
	perex: string
	imageId: string
	updatedAt: string
	createdAt: string
}
export type ArticleKey = keyof Article

export interface Comment {
	articleId: string
	author: string
	content: string
	commentId: string
	postedAt: string
	score: number
}

export interface ArticleWithComments extends Article {
	comments: Comment[]
}
