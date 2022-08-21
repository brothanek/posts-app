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
				<div className={`container ${className}`}>{children}</div>
			</main>
			<style jsx global>{`
				.container {
					max-width: 65rem;
					margin: 0 auto;
					padding-top: 50px;
				}
			`}</style>
		</React.Fragment>
	)
}
