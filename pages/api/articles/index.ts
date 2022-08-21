import axios from 'axios'
import { authHeaders } from 'utils/middleware/apiHelpers'
import formidable from 'formidable'
import nc from 'next-connect'
import fs from 'fs'
import FormData from 'form-data'

import type { NextApiRequest, NextApiResponse } from 'next'

const form = formidable({})

const handler = nc<NextApiRequest, NextApiResponse>()
	.get(async (req, res) => {
		try {
			const { data } = await axios.get(`${process.env.API_URL}/articles`, {
				headers: { 'X-API-KEY': process.env.X_API_KEY || '' },
			})
			res.status(200).json(data.items || [])
		} catch (e) {
			console.log(e)
			return res.json({ e })
		}
	})
	.post(async (req, res) => {
		const headers = authHeaders(req, res)

		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log(err)
			} else {
				try {
					const imagePath = (files.image as formidable.File).toJSON().filepath
					const inputsPath = (files.inputs as formidable.File).toJSON().filepath
					const imageFile = fs.createReadStream(imagePath)

					const formData = new FormData()
					formData.append('image', imageFile)

					const {
						status,
						data,
						data: { imageId },
					} = await axios.post(`${process.env.API_URL}/images`, formData, {
						headers: { ...headers, 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
					})

					fs.readFile(inputsPath, 'utf-8', async (err, inputs) => {
						if (err) {
							return res.status(401).json({ message: 'Error while reading file' })
						} else {
							console.log(inputs)

							const { data: rData } = await axios.post(
								`${process.env.API_URL}/articles`,
								{ imageId: data[0].imageId, ...JSON.parse(inputs) },
								{
									headers,
								},
							)
							return res.status(200).json({ message: 'Successfully uploaded!', rData })
						}
					})
				} catch (e) {
					console.log(e, 'error')
					return res.status(401).json({ message: 'Error' })
				}
			}
		})
	})

export default handler

export const config = {
	api: {
		bodyParser: false,
	},
}
