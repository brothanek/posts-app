import { useState } from 'react'
import toast from 'react-hot-toast'

export const CustomToast = ({
	body,
	className,
	title,
	actions: { confirm = 'Yes', cancel = 'No' },
	onConfirm = () => {},
	initialOpen = false,
	modal = true,
}: {
	className?: string
	title: string
	body?: React.ReactNode
	actions: { confirm: React.ReactNode; cancel: React.ReactNode }
	onConfirm?: (P: any) => void
	initialOpen?: boolean
	modal?: boolean
}) => {
	const [open, setOpen] = useState(initialOpen)
	const closeModal = () => {
		setOpen(false)
	}
	if (!open) return null
	return (
		<div className={`${modal && 'modal'} ${className}`}>
			<div className="modal-box min-w-full items-center flex-col">
				<h3 className="font-bold text-lg">{title}</h3>
				{body && <p className="py-2">{body}</p>}
				<div className="modal-action py-2">
					<button
						onClick={(e) => {
							onConfirm(e)
							setOpen(false)
						}}
						className="btn"
					>
						{confirm}
					</button>
					<button onClick={closeModal} className="btn btn-link">
						{cancel}
					</button>
				</div>
			</div>
		</div>
	)
}

export const toastify = ({
	title,
	body,
	actions = { confirm: 'Yes', cancel: 'No' },
	onConfirm = () => {},
	initialOpen = true,
}: {
	body?: React.ReactNode
	title: string
	actions?: { confirm: string; cancel: string }
	onConfirm?: (P: any) => void
	initialOpen?: boolean
}) => {
	return toast.custom(
		<CustomToast
			modal={false}
			title={title}
			body={body}
			initialOpen={initialOpen}
			onConfirm={onConfirm}
			actions={actions}
		/>,
		{ position: 'bottom-center', duration: 10000 },
	)
}
