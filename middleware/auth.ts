import nc from 'next-connect'
import dbConnect from 'lib/dbConnect.ts'
import passport from '../lib/passport'
import session from '../lib/session'
import type { NextApiResponse } from 'next'
import type { NextApiRequestWithUser } from 'types'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(
		session({
			name: 'session',
			cookie: {
				maxAge: 60 * 60 * 8, // 8 hours,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				path: '/',
				sameSite: 'lax',
			},
		}),
	)
	.use(async (req, res, next) => {
		await dbConnect()
		next()
	})
	.use(passport.initialize())
	.use(passport.session())

export default handler
