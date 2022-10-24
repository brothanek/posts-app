import { getLoginSession } from 'lib/auth'
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next'
import { parseCookies } from 'lib/session'

export function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const { req, res } = ctx

		let user = null
		try {
			const cookies = parseCookies(req)
			if (cookies.session) {
				user = (await getLoginSession(cookies.session))?.passport?.user
			}

			if (!user) {
				return {
					redirect: {
						permanent: false,
						destination: '/auth',
					},
				}
			}
		} catch (error) {
			console.log(error)
			// Failure in the query or any error should fallback here
			// this route is possibly forbidden means the cookie is invalid
			// or the cookie is expired
			return {
				redirect: {
					permanent: false,
					destination: '/auth',
				},
			}
		}
		// FIXME: Custom type for gssp with user as a prop
		// @ts-ignore
		return gssp({ ...ctx, user })
	}
}
