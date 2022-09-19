import React from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import { requireAuthentication } from 'middleware/requireAuth'
import Layout from 'components/Layout'
import { getUserArticles } from 'pages/api/articles'
import SortableTable from 'components/articles/SortableTable'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps } from 'types'

const Dashboard: NextPage<{ articles: ArticleProps[] }> = ({ articles }) => {
	const Router = useRouter()
	const navigate = () => {
		Router.push('dashboard/create')
	}

	return (
		<Layout>
			<div className="flex md:flex-row flex-col items-start md:items-center my-20">
				<h1>My Articles</h1>

				<button className="md:ml-10 mt-6 md:mt-0 primary-btn" onClick={navigate}>
					Create new article
				</button>
			</div>
			<SortableTable tableData={articles} />
		</Layout>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async (ctx) => {
	//FIXME: type gssp properly so ctx is not any
	const { username } = (ctx as any).user

	try {
		const data: ArticleProps[] = JSON.parse(JSON.stringify(await getUserArticles(username)))
		const articles = data.map(({ comments, ...rest }) => ({ ...rest, comments: comments.length }))

		return {
			props: { articles }, // will be passed to the page component as props
		}
	} catch (e) {
		console.log(e)

		return { props: {} }
	}
})
