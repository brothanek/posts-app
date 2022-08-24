import ArticleForm from '@components/forms/ArticleForm'
import Layout from '@components/Layout'
import { requireAuthentication } from 'api-lib/middleware/requireAuth'

import type { GetServerSideProps, NextPage } from 'next'

const Dashboard: NextPage = () => {
	return (
		<Layout>
			<ArticleForm />
		</Layout>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
	return {
		props: {},
	}
})
