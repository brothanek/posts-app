import axios from 'axios'
import Cookies from 'cookies'
import nc from 'next-connect'

import type { NextApiRequest, NextApiResponse } from 'next'

const login = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const { username, password } = req.body

	try {
		const cookies = new Cookies(req, res)

		const response = await axios.post(
			`${process.env.API_URL}/login`,
			{ username, password },
			{ headers: { 'X-API-KEY': process.env.X_API_KEY! } },
		)

		const { access_token } = response.data

		cookies.set('accessToken', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'strict',
		})

		return res.status(200).json({ username })
	} catch (error) {
		console.error(error)
		return res.json({ error })
	}
})

export default login
