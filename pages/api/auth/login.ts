import nc from 'next-connect'
import passport from 'lib/passport'
import auth from 'middleware/auth'
import type { NextApiResponse } from 'next'
import type { NextApiRequestWithUser } from 'types'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(auth)
	.post(passport.authenticate('local'), async (req, res) => {
		const { username, id } = req.user
		res.json({ username, id })
	})

export default handler
