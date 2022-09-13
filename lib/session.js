import { parse, serialize } from 'cookie'
import { createLoginSession, getLoginSession } from './auth'

export function parseCookies(req) {
	// For API Routes we don't need to parse the cookies.
	if (req.cookies) return req.cookies

	// For pages we do need to parse the cookies.
	const cookie = req.headers?.cookie || ''
	return parse(cookie)
}

export default function session({ name, cookie: cookieOpts }) {
	return async (req, res, next) => {
		const cookies = parseCookies(req)
		const token = cookies[name]
		let unsealed = {}

		if (token) {
			try {
				unsealed = await getLoginSession(token)
			} catch (e) {
				// The cookie is invalid
			}
		}

		req.session = unsealed

		// We are proxying res.end to commit the session cookie
		const oldEnd = res.end
		res.end = async function resEndProxy(...args) {
			if (res.finished || res.writableEnded || res.headersSent) return
			if (cookieOpts.maxAge) {
				req.session.maxAge = cookieOpts.maxAge
			}

			const token = await createLoginSession(req.session)

			res.setHeader('Set-Cookie', serialize(name, token, cookieOpts))
			oldEnd.apply(this, args)
		}

		next()
	}
}
