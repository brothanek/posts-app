import Iron from '@hapi/iron'

export async function createLoginSession(session: any) {
	const createdAt = Date.now()
	const obj = { ...session, createdAt }
	const token = await Iron.seal(obj, process.env.SESSION_SECRET!, Iron.defaults)

	return token
}

export async function getLoginSession(token: string) {
	const session = await Iron.unseal(token, process.env.SESSION_SECRET!, Iron.defaults)
	const expiresAt = session.createdAt + session.maxAge * 1000

	// Validate the expiration date of the session
	if (session.maxAge && Date.now() > expiresAt) {
		throw new Error('Session expired')
	}

	return session
}
