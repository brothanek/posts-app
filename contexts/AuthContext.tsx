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

	const handleError = (error: string) => toast.error(error)

	// Sign in
	const signIn = useCallback(
		async (credentials: SignInProps) => {
			try {
				const { username, id } = (await axios.post(`/api/auth/login`, credentials)).data
				setUser({ username, authenticated: id })

				toast.success(username + ' was logged in')
			} catch (error: any) {
				if (error.response.status === 401) {
					handleError('Wrong username or password')
					return
				}
				console.error(error)
				handleError('Something went wrong')
			}
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
			try {
				const { username, id } = (await axios.post(`/api/auth/user`, credentials)).data

				setUser({ username, authenticated: id })
				Router.push('/dashboard')
				toast.success(username + ' was registered')
			} catch (error: any) {
				if (error.response.status === 409) {
					handleError('This username already exists')
					return
				}
				console.error(error)
				handleError('Something went wrong')
			}
		},
		[Router],
	)

	const signOut = useCallback(async () => {
		try {
			await axios.post(`/api/auth/logout`)
			setUser({ username: null, authenticated: false })
			Router.reload()
			toast.success(user?.username + ' logged out')
		} catch (error) {
			console.error(error)
		}
	}, [Router, user])
	const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signOut, signUp])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
