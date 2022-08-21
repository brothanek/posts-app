import React, { useMemo } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createContext, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useContext } from 'react'
import { useCallback } from 'react'
import type { SignInProps } from 'types'

const AuthContext = createContext({
	user: '',
	signIn: (credentials: SignInProps) => {
		return
	},
	signOut: () => {
		return
	},
})

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<string>('')

	const Router = useRouter()

	const checkIfLoggedIn = () => {
		try {
			const storageUser = localStorage.getItem('user')!
			setUser(storageUser)
		} catch (e) {}
	}

	useEffect(() => {
		checkIfLoggedIn()
	}, [])

	const handleError = (error: string) => toast.error(error)

	// Sign in
	const signIn = useCallback(
		async (credentials: SignInProps) => {
			try {
				const res = await axios.post(`/api/auth/login`, credentials)

				if (res.data.error) {
					handleError(res.data.error.message)
					return
				}

				const { username } = res.data
				setUser(username)
				localStorage.setItem('user', username)
				Router.push('/dashboard')
				toast.success(username + ' was logged in')
			} catch (error) {
				console.error(error)
				handleError(JSON.stringify(error))
			}
		},
		[Router],
	)

	// Sign out
	const signOut = useCallback(async () => {
		try {
			await axios.post(`/api/auth/logout`)
			setUser('')
			Router.push('/')
			toast.success('Logged out successfully!')
		} catch (error) {
			console.error(error)
		}
	}, [Router])
	const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
