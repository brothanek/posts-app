import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import _ from 'lodash'
import toast from 'react-hot-toast'
import { requireAuthentication } from 'utils/requireAuth'
import Layout from '@components/Layout'
import SortingTable from '@components/articles/SortingTable'
import type { GetServerSideProps, NextPage } from 'next'
import type { Article, ArticleKey } from 'types'

const Dashboard: NextPage<{ data: Article[] }> = ({ data }) => {
	const Router = useRouter()

	return (
		<Layout>
			<div className="flex items-center my-20">
				<h1>My Articles</h1>

				<button
					className="ml-10 bg-blue-500 hover:bg-blue-700 rounded text-white px-2 py-2"
					onClick={() => Router.push('dashboard/create')}
				>
					Create new article
				</button>
			</div>
			<SortingTable DATA={data} />
		</Layout>
	)
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = requireAuthentication(async () => {
	const response = await axios.get(`${process.env.API_URL}/articles`, {
		headers: { 'X-API-KEY': process.env.X_API_KEY || '' },
	})

	const data: Article[] = response?.data?.items || []

	return {
		props: { data }, // will be passed to the page component as props
	}
})
