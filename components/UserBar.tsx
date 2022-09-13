import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useAuth } from '@contexts/AuthContext'
import { Avatar } from './Avatar'
import { ActiveLink } from './Header'

const UserLinks = ({ inModal }: { inModal?: boolean }) => {
	const customClass = !inModal ? 'ml-5' : ''
	return (
		<>
			<ActiveLink className={customClass} activeColor="#2B7EFB" unusedColor="black" href={'/dashboard'}>
				<span>My Articles</span>
			</ActiveLink>
			<ActiveLink className={customClass} activeColor="#2B7EFB" unusedColor="black" href={'/dashboard/create'}>
				<span>Create Article</span>
			</ActiveLink>
		</>
	)
}

const UserBar = ({ className = '' }: { className?: string }) => {
	const {
		user: { username },
		signOut,
	} = useAuth()

	return (
		<ul className="flex items-center">
			<li className="hidden lg:block">
				<UserLinks />
			</li>

			<li className={`dropdown dropdown-hover dropdown-end ml-4 ${className}`}>
				<div tabIndex={0} className="flex items-center cursor-pointer hover:bg-gray-300 rounded px-2 py-1">
					<div className="arrow-down mr-2" />
					<Avatar username={username} />
				</div>
				<ul tabIndex={0} className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-52">
					<div className="flex flex-col items-center">
						<span className="font-semibold">{username}</span>
						<div className="divider my-0" />
					</div>
					<li className="block lg:hidden">
						<UserLinks inModal />
					</li>
					<li>
						<button onClick={() => signOut()} className="">
							<span>Logout </span>
							<BiLogOut />
						</button>
					</li>
				</ul>
			</li>
		</ul>
	)
}

export default UserBar
