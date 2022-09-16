import Link, { LinkProps } from 'next/link'
import React from 'react'

interface WithLinkProps extends LinkProps {
	className?: string
	children?: React.ReactNode
}

const WithLink = ({ children, href, className = '', ...rest }: WithLinkProps) => {
	return (
		<Link href={href} {...rest}>
			<a className={`${className}`}>{children}</a>
		</Link>
	)
}

export default WithLink
