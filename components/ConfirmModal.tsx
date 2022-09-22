export const ConfirmDropdown = ({
	hiddenContent = 'confirm',
	onConfirm = () => {},
	children,
	direction = 'left',
}: {
	hiddenContent: React.ReactNode
	onConfirm: (P: any) => void
	children: React.ReactNode
	direction?: 'left' | 'right' | 'top' | 'bottom'
}) => (
	<div className={`dropdown dropdown-${direction} dropdown-hover`}>
		<button tabIndex={0}>{children}</button>

		<ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box px-3 py-2">
			<button onClick={onConfirm}>{hiddenContent}</button>
		</ul>
	</div>
)
