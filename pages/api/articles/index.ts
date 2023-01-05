import nc from 'next-connect'
import Article from 'models/Article'
import dbConnect from 'lib/dbConnect.ts'
import auth from 'middleware/auth'
import { ArticleProps, NextApiRequestWithUser } from 'types'
import type { NextApiResponse } from 'next'
import axios from 'axios'

type EAInput = {
	id: number | string
	data: {
		number: number | string
		infoType: string
	}
}

type EAOutput = {
	jobRunId: string | number
	statusCode: number
	data: {
		result?: any
	}
	error?: string
}

export const getUserArticles = async (username: string) => {
	await dbConnect()
	return await Article.find({ author: username }).sort({ createdAt: -1 })
}

const CONFIG = { page: '1', limit: '8', sort: { createdAt: 'desc' } }
const query = { privateDoc: false }

export const getArticles = async () => {
	await dbConnect()
	return await Article.find({
		$or: [query],
	}).sort({ createdAt: -1 })
}

export const getPaginatedArticles = async (options = CONFIG) => {
	await dbConnect()
	// find public articles
	var myAggregate = Article.aggregate([{ $match: query }])
	// @ts-ignore
	return await Article.aggregatePaginate(myAggregate, options, function (err, results) {
		if (err) {
			console.error(err)
			return []
		} else {
			return results
		}
	})
}

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.get(async (req, res) => {
		await dbConnect()

		const { page, limit, sort } = req.query
		const options = {
			page: page + '' || CONFIG.page,
			limit: limit + '' || CONFIG.limit,
			sort: { createdAt: sort + '' || CONFIG.sort.createdAt },
		}
		try {
			if (page || limit || sort) {
				const articles = await getPaginatedArticles(options)
				res.status(200).json(articles)
			} else {
				const articles = await getArticles()
				res.status(200).json(articles)
			}
		} catch (error) {
			console.log(error)
			res.status(400).json({ success: false, error })
		}
	})
	// .use(auth)
	.post(async function (req: any, res: Response) {
		const eaInputData: EAInput = req.body
		console.log(' Request data received: ', eaInputData)

		// Build API Request
		const url = `http://numbersapi.com/${eaInputData.data.number}/${eaInputData.data.infoType}`

		let eaResponse: EAOutput = {
			data: {},
			jobRunId: eaInputData.id,
			statusCode: 0,
		}

		try {
			const apiResponse = await axios.get(url)

			eaResponse.data = { result: apiResponse.data }
			eaResponse.statusCode = apiResponse.status
			// @ts-ignore
			res.json(eaResponse)
		} catch (error: any) {
			console.error('API Response Error: ', error)
			eaResponse.error = error.message
			eaResponse.statusCode = error.response.status
			// @ts-ignore
			res.json(eaResponse)
		}

		console.log('returned response:  ', eaResponse)
		return
	})

export default handler
