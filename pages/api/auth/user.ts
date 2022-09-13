import nc from 'next-connect'
import User from 'models/User'
import auth from 'middleware/auth'
import { NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import type { NextApiRequestWithUser } from 'types'

const handler = nc<NextApiRequestWithUser, NextApiResponse>()
	.use(auth)
	.post(async (req, res) => {
		const { username, password } = req.body

		User.findOne({ username }).then(async (user) => {
			if (user) {
				res.status(409).json({ message: 'Username already exists' })
			} else {
				const saltRounds = 10
				const hashedPassword = await bcrypt.hash(password, saltRounds)
				const newUser = new User({ username, password: hashedPassword })
				await newUser.save()
				console.log(newUser.username + ' saved')

				req.login(newUser, function (err: any) {
					if (err) {
						console.log(err)
						res.status(400).json({ message: 'Error logging in' })
					}
					res.status(200).json({ username: req.user.username })
				})
			}
		})
	})
	.get((req, res) => {
		const { username, id } = req?.user || {}
		res.json({ username, id })
	})

export default handler
