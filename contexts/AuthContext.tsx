import React, { useMemo } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createContext, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useContext } from 'react'
import { useCallback } from 'react'
import type { SignInProps, SignUpProps } from 'types'

const AuthContext = createContext({
	user: { username: null, authenticated: false } as User,
	signIn: (credentials: SignInProps) => {
		return
	},
	signUp: (credentials: SignUpProps) => {
		return
	},
	signOut: () => {
		return
	},
})

export const useAuth = () => {
	return useContext(AuthContext)
}

export interface User {
	username: string | null
	authenticated: string | false
}
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User>({ username: '', authenticated: false })

	const Router = useRouter()

	const checkIfLoggedIn = async () => {
		try {
			const { username, id } = (await axios.get('/api/auth/user')).data
			setUser({ username, authenticated: id })
		} catch (e) {
			setUser({ username: null, authenticated: false })
		}
	}

	useEffect(() => {
		let disabled = false
		const auth = async () => {
			if (!disabled) {
				await checkIfLoggedIn()
			}
		}
		auth()
		return () => {
			disabled = true
		}
	}, [Router])

	// Sign in
	const signIn = useCallback(
		async (credentials: SignInProps) => {
			const { username, id } = (
				await toast.promise(axios.post(`/api/auth/login`, credentials), {
					loading: 'Signing in...',
					success: 'Signed in!',
					error: 'Error signing in',
				})
			).data
			setUser({ username, authenticated: id })

			// handle redirecting
			const redirect = Router.query.redirect as string
			if (redirect) {
				if (redirect === 'back') {
					Router.back()
				} else {
					Router.push(redirect)
				}
			} else {
				Router.push('/dashboard')
			}
		},
		[Router],
	)
	const signUp = useCallback(
		async (credentials: SignUpProps) => {
			const { username, id } = (
				await toast.promise(axios.post(`/api/auth/user`, credentials), {
					loading: 'Signing up...',
					success: 'Signed up!',
					error: ({ response }) => {
						if (response?.status === 409) {
							return 'Username already exists'
						}
						return 'Error signing up'
					},
				})
			).data

			setUser({ username, authenticated: id })
			Router.push('/dashboard')
		},
		[Router],
	)

	const signOut = useCallback(async () => {
		await toast.promise(axios.post(`/api/auth/logout`), {
			loading: 'Signing out...',
			success: 'Signed out!',
			error: 'Error signing out',
		})
		setUser({ username: null, authenticated: false })
		Router.reload()
	}, [Router])

	return <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export default AuthContext
