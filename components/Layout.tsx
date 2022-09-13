import Head from 'next/head'
import Header from 'components/Header'
import React from 'react'

interface Props {
	children: React.ReactNode
	title?: string
	className?: string
}

export default function Layout({ children, title, className }: Props) {
	return (
		<React.Fragment>
			<Head>
				<title>{(title && title) || 'Articles'}</title>
				<meta name="description" content="Get to read the newest articles about your favorite topics" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main>
				<div className={`w-screen sm:w-2/3 mx-auto mt-0 pt-12 h-full px-8 sm:px-4 md:px-2 ${className}`}>
					{children}
				</div>
			</main>
		</React.Fragment>
	)
}
