import { useRouter } from 'next/router'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { useAuth } from 'contexts/AuthContext'
import WithLink from './WithLink'

interface ActiveLinkProps extends LinkProps {
	children: React.ReactNode
	activeColor?: string
	unusedColor?: string
}

function ActiveLink({ children, href, activeColor = 'black', unusedColor = 'gray', ...rest }: ActiveLinkProps) {
	const Router = useRouter()

	const color = Router.asPath === href ? activeColor : unusedColor

	return (
		<Link href={href} {...rest}>
			<a className="ml-5 hover:opacity-70" style={{ color }}>
				{children}
			</a>
		</Link>
	)
}
const Header = () => {
	const { user } = useAuth()

	return (
		<header>
			<nav className="flex justify-center fixed w-screen bg-nav border-1 z-50">
				<div className="flex height-14 w-2/3 items-center relative">
					<WithLink href={'/'}>
						<Image height={'44'} width={'39'} src="/logo.svg" alt="logo" />
					</WithLink>

					<div className="ml-5 hidden md:flex">
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
								<ActiveLink activeColor="#2B7EFB" unusedColor="black" href={'/dashboard'}>
									<span>My Articles</span>
								</ActiveLink>
								<ActiveLink activeColor="#2B7EFB" unusedColor="black" href={'/dashboard/create'}>
									<span>Create Article</span>
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
			</nav>
		</header>
	)
}

export default Header
