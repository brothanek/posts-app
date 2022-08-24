import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import toast from 'react-hot-toast'
import { requireAuthentication } from 'api-lib/middleware/requireAuth'
import Layout from '@components/Layout'
import SortingTable from '@components/articles/SortingTable'
import type { GetServerSideProps, NextPage } from 'next'
import type { ArticleProps, ArticleKey } from 'types'
import { getArticles } from '@pages/api/articles'

const Dashboard: NextPage<{ data: ArticleProps[] }> = ({ data }) => {
	const Router = useRouter()
	const navigate = () => {
		Router.push('dashboard/create')
	}

	return (
		<Layout>
			<div className="flex sm:flex-row flex-col items-center my-20">
				<h1>My Articles</h1>

				<button className="ml-10 mt-4 sm:mt-0 primary-btn" onClick={navigate}>
					Create new article
				</button>
			</div>
			<SortingTable DATA={data} />
		</Layout>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
	try {
		const data: ArticleProps[] = JSON.parse(JSON.stringify(await getArticles()))

		return {
			props: { data }, // will be passed to the page component as props
		}
	} catch (e) {
		console.log(e)

		return { props: {} }
	}
})
