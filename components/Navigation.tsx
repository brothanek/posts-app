import type { ReactNode } from 'react'

import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from 'contexts/AuthContext'

interface ALinkProps {
	children: ReactNode
	href: string
	activeColor?: string
	unusedColor?: string
}

function ActiveLink({ children, href, activeColor = 'black', unusedColor = 'gray' }: ALinkProps) {
	const Router = useRouter()
	const style = {
		color: Router.asPath === href ? activeColor : unusedColor,
	}

	return (
		<Link href={href}>
			<a className="ml-5" style={style}>
				{children}
			</a>
		</Link>
	)
}
const Navigation = () => {
	const { user } = useAuth()

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
						<span>Recent Articles</span>
					</ActiveLink>
					<ActiveLink href="/about">
						<span>About</span>
					</ActiveLink>
				</div>

				<div className="absolute right-0">
					{user ? (
						<div className="flex">
							<ActiveLink activeColor="blue" unusedColor="black" href={'/dashboard'}>
								<a className="flex">
									<span>My Articles</span>
								</a>
							</ActiveLink>
							<ActiveLink activeColor="blue" unusedColor="black" href={'/dashboard/create'}>
								<a className="flex ml-5">
									<span>Create Article</span>
								</a>
							</ActiveLink>
						</div>
					) : (
						<Link href={'/auth'}>
							<a className="flex">
								<span className="text-blue">Log in</span>
								<Image height={'24'} width={'24'} src="/arrow-right.svg" alt="logo" />
							</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default Navigation
