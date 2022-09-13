import nc from 'next-connect'
import auth from 'middleware/auth'
import type { NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(auth)
	.post((req, res) => {
		req.logOut()
		res.status(204).end()
	})

export default handler
