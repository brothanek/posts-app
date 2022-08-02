import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

const logout = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	if (req.method === 'POST') {
		const cookies = new Cookies(req, res)

		// Destroy cookie
		cookies.set('accessToken', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			expires: new Date(0),
			sameSite: 'strict',
			path: '/',
		})
		res.status(200).json({ message: 'Successfully logged out!' })
	} else {
		res.setHeader('Allow', ['POST'])
		res.status(405).json({ message: `Method ${req.method} not allowed!` })
	}
}

export default logout
