import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import type { ReactNode, MouseEvent } from 'react'

function ActiveLink({ children, href }: { children: ReactNode; href: string }) {
	const router = useRouter()
	const style = {
		color: router.asPath === href ? 'black' : 'gray',
	}

	const handleClick = (e: MouseEvent) => {
		e.preventDefault()
		router.push(href)
	}

	return (
		<a href={href} onClick={handleClick} style={style}>
			{children}
		</a>
	)
}
const Navigation = () => {
	return (
		<div className="flex justify-center fixed w-screen bg-nav border-1 text-black">
			<div className="flex height-14 w-2/3 items-center relative">
				<Link href={'/'}>
					<a>
						<Image height={'44'} width={'39'} src="/logo.svg" alt="logo" />
					</a>
				</Link>

				<div className="flex ml-5">
					<ActiveLink href={'/'}>
						<a className="ml-5">Recent Articles</a>
					</ActiveLink>
					<ActiveLink href="/about">
						<span className="ml-5">About</span>
					</ActiveLink>
				</div>

				<div className="absolute right-0">
					{/* logged out */}
					<Link href={'/login'}>
						<a className="flex">
							<span className="text-blue">Log in</span>
							<Image height={'24'} width={'24'} src="/arrow-right.svg" alt="logo" />
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Navigation
