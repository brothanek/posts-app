import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

export const authHeaders = (req: NextApiRequest, res: NextApiResponse) => {
	const cookies = new Cookies(req, res)
	const accessToken = cookies.get('accessToken')

	return { 'X-API-KEY': process.env.X_API_KEY!, Authorization: `Bearer ${accessToken}` }
}
