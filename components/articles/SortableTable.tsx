import React, { useMemo, useState } from 'react'
import _ from 'lodash'
import Link from 'next/link'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'
import { FormattedDate } from 'react-intl'
import WithLink from 'components/WithLink'
import { deleteArticle } from 'lib/calls'
import type { ArticleProps, ArticleKey } from 'types'

const COLUMNS: { accessor: ArticleKey; Header: string }[] = [
	{ accessor: 'title', Header: 'Article Title' },
	{ accessor: 'perex', Header: 'Perex' },
	{ accessor: 'comments', Header: 'Comments #' },
	{ accessor: 'privateDoc', Header: 'Private' },
	{ accessor: 'createdAt', Header: 'Created at' },
]

export const SortableTable = ({ tableData = [] }: { tableData: ArticleProps[] }) => {
	const [articles, setArticles] = useState(tableData || [])
	const columns = useMemo(() => COLUMNS, [])
	const data = useMemo(() => articles, [articles])

	const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow, setGlobalFilter } = useTable(
		{
			columns,
			data,
			initialState: {
				sortBy: [
					{
						id: 'createdAt',
						desc: true,
					},
				],
			},
		},
		useGlobalFilter,
		useSortBy,
	)

	const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const id = event.currentTarget.id
		event.preventDefault()
		const { data } = await deleteArticle(id)
		if (data?.success) setArticles((arr) => _.filter(arr, ({ _id }) => _id !== id))
	}
	const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget
		setGlobalFilter(value)
	}

	return (
		<div className="flex flex-col">
			<input className="input input-bordered max-w-sm mb-2" placeholder="Search" onChange={handleFilterInputChange} />
			<div className="overflow-x-auto lg:-mx-8">
				<div className="py-2 inline-block min-w-full">
					<div className="overflow-x">
						<table className="max-w-full" {...getTableProps()}>
							<thead className="border-b">
								{headerGroups.map((headerGroup) => (
									// eslint-disable-next-line react/jsx-key
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											// eslint-disable-next-line react/jsx-key
											<th {...column.getHeaderProps(column.getSortByToggleProps())}>
												<div className="flex items-center">
													{column.render('Header')}
													<span className="pl-0.5">
														{column.isSorted ? column.isSortedDesc ? <MdArrowDownward /> : <MdArrowUpward /> : ''}
													</span>
												</div>
											</th>
										))}
										<th>Actions</th>
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{rows.length === 0 && (
									<tr>
										<td colSpan={COLUMNS.length + 1} className="text-center">
											No articles found
										</td>
									</tr>
								)}
								{rows.map((row) => {
									prepareRow(row)
									const { _id } = row.original
									const link = `articles/${_id}/view`
									return (
										// eslint-disable-next-line react/jsx-key
										<tr {...row.getRowProps()} className="border-b hover:bg-gray-100">
											{row.cells.map((cell) => {
												if (cell.column.id == 'createdAt') {
													return (
														<td {...cell.getCellProps()}>
															<WithLink className="hover:text-blue-500" href={link}>
																<FormattedDate value={cell.value} />
															</WithLink>
														</td>
													)
												} else if (cell.column.id == 'privateDoc') {
													return (
														<td {...cell.getCellProps()}>
															<WithLink className="hover:text-blue-500" href={link}>
																{cell.value ? 'Yes' : 'No'}
															</WithLink>
														</td>
													)
												}
												return (
													// eslint-disable-next-line react/jsx-key
													<td className="max-w-xs truncate" {...cell.getCellProps()}>
														<WithLink className="hover:text-blue-500" href={link}>
															{cell.render('Cell')}
														</WithLink>
													</td>
												)
											})}
											{/* Actions */}
											<td>
												<ul className="flex">
													<li>
														<button id={_id} onClick={handleDelete}>
															<AiOutlineDelete size="22" />
														</button>
													</li>
													<li className="ml-3">
														<Link href={`articles/${_id}/edit`}>
															<a>
																<FiEdit2 size="20" />
															</a>
														</Link>
													</li>
												</ul>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SortableTable
