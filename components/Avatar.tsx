export const Avatar = ({ username = '' }: { username: string | null }) => (
	<div className="relative flex items-center justify-center rounded-full w-8 h-8 bg-gray-500 mr-4">
		{username && <span className="absolute uppercase text-white">{username[0]}</span>}
	</div>
)
