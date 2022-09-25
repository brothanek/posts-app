import { useState } from 'react'
import toast from 'react-hot-toast'

interface ToastOptions {
	body?: React.ReactNode
	className?: string
	title: string
	actions?: { confirm: React.ReactNode; cancel: React.ReactNode }
	onConfirm?: (P: any) => void
	initialOpen?: boolean
}

export const CustomToast = ({
	body,
	className = '',
	title,
	actions = { confirm: 'Yes', cancel: 'No' },
	onConfirm = () => {},
	initialOpen = false,
	modal = true,
}: ToastOptions & { modal: any }) => {
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
						{actions.confirm}
					</button>
					<button onClick={closeModal} className="btn btn-link">
						{actions.cancel}
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
}: ToastOptions) => {
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
