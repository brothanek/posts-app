import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createContext, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useContext } from 'react'

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

export const AuthProvider = ({ children }: ProviderProps) => {
	const [user, setUser] = useState<string>('')

	const Router = useRouter()

	const checkIfLoggedIn = () => {
		try {
			const storageUser = localStorage.getItem('user') || ''
			setUser(storageUser)
		} catch (e) {}
	}

	useEffect(() => {
		checkIfLoggedIn()
	}, [])

	const handleError = (error: string) => toast.error(error)

	// Sign in
	const signIn = async (credentials: SignInProps) => {
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
	}

	// Sign out
	const signOut = async () => {
		try {
			await axios.post(`/api/auth/logout`)
			setUser('')
			Router.push('/')
			toast.success('Logged out successfully!')
		} catch (error) {
			console.error(error)
		}
	}

	return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export default AuthContext
