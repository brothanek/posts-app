import nc from 'next-connect'

import type { NextApiRequest, NextApiResponse } from 'next'
const logout = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	// const cookies = new Cookies(req, res)

	// // Destroy cookie
	// cookies.set('accessToken', '', {
	// 	httpOnly: true,
	// 	secure: process.env.NODE_ENV !== 'development',
	// 	expires: new Date(0),
	// 	sameSite: 'strict',
	// 	path: '/',
	// })
	res.status(200).json({ message: 'Successfully logged out!' })
})

export default logout
