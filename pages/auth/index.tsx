import type { NextPage } from 'next'

import { useState } from 'react'
import Head from 'next/head'
import LoginForm from '@components/forms/auth/LoginForm'

const AuthPage: NextPage = () => {
	const [creatingAcc, setCreatingAcc] = useState(false)

	const switchContext = () => {
		setCreatingAcc((prevState) => !prevState)
	}

	return (
		<div>
			<Head>
				<title>Articles</title>
				<meta name="description" content="Get to read the newest articles about your favorite animals" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>{creatingAcc ? <LoginForm /> : <LoginForm />}</main>
		</div>
	)
}

export default AuthPage
