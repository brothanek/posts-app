import axios from 'axios'
import nc from 'next-connect'
import { authHeaders } from 'utils/middleware/apiHelpers'

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = nc<NextApiRequest, NextApiResponse>()
	.get(async (req, res) => {
		const { id } = req.query
		const headers = authHeaders(req, res)
		try {
			const { status, data } = await axios.get(`${process.env.API_URL}/articles/${id}`, { headers })
			console.log(status)
			if (status == 200) {
				return res.status(200).json({ data })
			} else {
				return res.status(400).json({ message: 'Something went wrong' })
			}
		} catch (error) {
			console.log(error)
			return res.json({ error })
		}
	})
	.patch(async (req, res) => {
		const { id } = req.query
		const headers = authHeaders(req, res)
		try {
			const { status, data } = await axios.patch(`${process.env.API_URL}/articles/${id}`, req.body, { headers })
			if (status == 200) {
				return res.status(200).json({ data, message: 'Article successfully updated' })
			} else {
				return res.status(400).json({ message: 'Something went wrong' })
			}
		} catch (error) {
			console.log(error)
			return res.json({ error })
		}
	})
	.delete(async (req, res) => {
		const { id } = req.query
		const headers = authHeaders(req, res)
		try {
			const { status, data } = await axios.delete(`${process.env.API_URL}/articles/${id}`, { headers })
			console.log(status)
			if (status == 204) {
				return res.status(200).json({ message: 'Successfully deleted' })
			} else {
				return res.status(400).json({ message: 'Something went wrong' })
			}
		} catch (error) {
			console.log(error)
			return res.json({ error })
		}
	})

export default handler
