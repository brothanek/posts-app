import axios from 'axios'
import Cookies from 'cookies'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export function requireAuthentication(gssp: GetServerSideProps) {
	return async (ctx: GetServerSidePropsContext) => {
		const { req, res } = ctx
		const cookies = new Cookies(req, res)

		if (req.headers.cookie) {
			const accessToken = cookies.get('accessToken')

			try {
				// Send a request to the API and verify that the user  exists
				// Reject and redirect if the user is undefined or there is no accessToken
				// const response = await axios.get()
				// const { user } = response.data

				if (
					!accessToken
					// || !user || !user.email
				) {
					return {
						redirect: {
							permanent: false,
							destination: '/auth',
						},
					}
				}
			} catch (error) {
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
		}

		return await gssp(ctx)
	}
}
