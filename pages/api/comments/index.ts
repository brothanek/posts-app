import nc from 'next-connect'
import axios from 'axios'
import { authHeaders } from 'utils/middleware/apiHelpers'

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const headers = authHeaders(req, res)
	const body = req.body
	try {
		const { status, data } = await axios.post(`${process.env.API_URL}/comments`, body, { headers })
		console.log(status)
		if (status == 201 || status == 200) {
			return res.status(200).json({ data })
		} else {
			return res.status(400).json({ message: 'Something went wrong' })
		}
	} catch (error) {
		console.log(error)
		return res.json({ error })
	}
})

export default handler
