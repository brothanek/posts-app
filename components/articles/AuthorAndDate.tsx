import React from 'react'
import { FormattedDate } from 'react-intl'

const AuthorAndDate = ({ author = 'Name', date = '', className = '' }) => {
	return (
		<div className={`flex items-center ${className}`}>
			<span className="text-sm text-gray-500">{'by ' + author}</span>
			<div className="h-1 w-1 rounded-full bg-gray-500 mx-3" />
			<span className="text-sm text-gray-500">
				<FormattedDate value={date}></FormattedDate>
			</span>
		</div>
	)
}

export default AuthorAndDate
