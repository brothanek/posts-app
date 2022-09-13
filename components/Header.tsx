import { useRouter } from 'next/router'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { useAuth } from 'contexts/AuthContext'
import WithLink from './WithLink'
import UserBar from './UserBar'

interface ActiveLinkProps extends LinkProps {
	children: React.ReactNode
	activeColor?: string
	unusedColor?: string
	className?: string
}

export function ActiveLink({
	children,
	href,
	activeColor = 'black',
	unusedColor = 'gray',
	className = '',
	...rest
}: ActiveLinkProps) {
	const Router = useRouter()

	const color = Router.asPath === href ? activeColor : unusedColor

	return (
		<Link href={href} {...rest}>
			<a className={`hover:opacity-70 ${className}`} style={{ color }}>
				{children}
			</a>
		</Link>
	)
}

const Header = () => {
	const {
		user: { authenticated },
	} = useAuth()

	return (
		<header>
			<nav className="flex justify-center fixed w-screen bg-nav border-1 z-50">
				<div className="flex height-14 w-2/3 items-center relative">
					<WithLink href={'/'}>
						<Image height={'44'} width={'39'} src="/logo.svg" alt="logo" />
					</WithLink>

					<div className="hidden md:flex">
						<ActiveLink className="ml-5 " href={'/'}>
							<span>Recent Articles</span>
						</ActiveLink>
						<ActiveLink className="ml-5 " href="/about">
							<span>About</span>
						</ActiveLink>
					</div>

					<div className="absolute right-0">
						<div className="flex items-center">
							{authenticated ? (
								<UserBar />
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
			</nav>
		</header>
	)
}

export default Header
