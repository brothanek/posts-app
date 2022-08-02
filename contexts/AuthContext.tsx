import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createContext, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useContext } from 'react'

const URL = 'http://localhost:3000/'

interface ProviderProps {
	children: React.ReactNode
}

export interface SignUpProps {
	name: string
	username: string
	password: string
	confirmPassword: string
}

export interface SignInProps {
	username: string
	password: string
}

const AuthContext = createContext({
	user: undefined,
	error: undefined,
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

export const AuthProvider = ({ children }: ProviderProps) => {
	const [user, setUser] = useState()
	// Error is unknown to support every form of error this is any
	const [error, setError] = useState<any>()

	const Router = useRouter()

	const checkIfLoggedIn = () => {
		try {
			// const res = await axios.post(`${NEXT_URL}/api/auth/user`);
			// setUser('test')
		} catch (e) {}
	}

	useEffect(() => {
		checkIfLoggedIn()
	}, [])

	// Sign in
	const signIn = async (credentials: SignInProps) => {
		try {
			const res = await axios.post(`${URL}/api/auth/login`, credentials)

			if (res.data.error) {
				toast.error(res.data.error.message)
				setError(res.data.error.message)
				return
			}

			const { username } = res.data
			setUser(username)
			Router.push('/dashboard')
			toast.success(username + ' was logged in')
		} catch (error) {
			console.error(error)
			setError(error)
		}
	}

	// Sign out
	const signOut = async () => {
		try {
			await axios.post(`${URL}/api/auth/logout`)
			setUser(undefined)
			Router.push('/')
			toast.success('Logged out successfully!')
		} catch (error) {
			console.error(error)
		}
	}

	return <AuthContext.Provider value={{ user, error, signIn, signOut }}>{children}</AuthContext.Provider>
}

export default AuthContext
