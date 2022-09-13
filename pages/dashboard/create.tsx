import ArticleForm from '@components/forms/ArticleForm'
import Layout from '@components/Layout'
import { requireAuthentication } from 'middleware/requireAuth'

import type { GetServerSideProps, NextPage } from 'next'

const Dashboard: NextPage = ({ username }: { username?: string }) => {
	return (
		<Layout>
			<ArticleForm author={username} />
		</Layout>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (ctx) => {
	const { username } = (ctx as any).user
	try {
		return {
			props: { username }, // will be passed to the page component as props
		}
	} catch (e) {
		console.log(e)

		return { props: {} }
	}
})
