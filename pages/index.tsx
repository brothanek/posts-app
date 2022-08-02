import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Articles</title>
				<meta name="description" content="Get to read the newest articles about your favorite animals" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="bg-white h-screen">
				<h1 className="pt-20">Recent articles</h1>
			</main>
		</div>
	)
}

export default Home
