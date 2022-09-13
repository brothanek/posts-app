import { useState } from 'react'
import LoginForm from '@components/forms/auth/LoginForm'
import Layout from '@components/Layout'
import type { NextPage } from 'next'
import SignUpForm from '@components/forms/auth/SIgnUpForm'

const AuthPage: NextPage = () => {
	const [creatingAcc, setCreatingAcc] = useState(false)

	return (
		<Layout title="Login">
			{creatingAcc ? <SignUpForm setCreatingAcc={setCreatingAcc} /> : <LoginForm setCreatingAcc={setCreatingAcc} />}
		</Layout>
	)
}

export default AuthPage
