import { useState } from 'react'
import LoginForm from '@components/forms/auth/LoginForm'
import Layout from '@components/Layout'

import type { NextPage } from 'next'

const AuthPage: NextPage = () => {
	const [creatingAcc, setCreatingAcc] = useState(false)

	const toggle = () => {
		setCreatingAcc((prevState) => !prevState)
	}

	return <Layout title="Login">{creatingAcc ? <LoginForm /> : <LoginForm />}</Layout>
}

export default AuthPage
