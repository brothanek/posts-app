import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { requireAuthentication } from 'utils/requireAuth'

const Dashboard: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Articles</title>
				<meta name="description" content="Get to read the newest articles about your favorite animals" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="bg-white h-screen">
				<h1 className="pt-20">Dash</h1>
			</main>
		</div>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
	return {
		props: {},
	}
})
