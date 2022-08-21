import React from 'react'
import { FormattedDate } from 'react-intl'

const AuthorAndDate = ({ author = 'Name', date = '', className = '' }) => {
	return (
		<div className={`flex items-center ${className}`}>
			<p className="text-sm text-gray-500">{author}</p>
			<div className="h-1 w-1 rounded-full bg-gray-500 mx-4" />
			<p className="text-sm text-gray-500">
				<FormattedDate value={date}></FormattedDate>
			</p>
		</div>
	)
}

export default AuthorAndDate
