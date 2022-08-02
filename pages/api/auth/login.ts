import axios from 'axios'
import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

// Custom imports

const login = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'POST') {
		const { username, password } = req.body
		try {
			const cookies = new Cookies(req, res)

			const response = await axios.post(
				'https://fullstack.exercise.applifting.cz/login',
				{ username, password },
				{ headers: { 'X-API-KEY': process.env.X_API_KEY || '' } },
			)
			const { access_token: accessToken } = response?.data

			cookies.set('accessToken', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== 'development',
				sameSite: 'strict',
			})

			return res.status(200).json({ username })
		} catch (error) {
			console.error(error)
			return res.json({ error })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		return res.status(405).json({ message: `Method ${req.method} not allowed!` })
	}
}

export default login
