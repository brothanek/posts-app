import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'

export const Loader = () => {
	return (
		<div className="fixed bottom-8 right-8">
			<div className="h-12 w-12 block rounded-full border-8 border-t-blue-300 animate-spin" />
		</div>
	)
}
const RouterLoader = () => {
	const router = useRouter()

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const handleStart = () => {
			setLoading(true)
		}
		const handleComplete = () => {
			setLoading(false)
		}

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleComplete)
		router.events.on('routeChangeError', handleComplete)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleComplete)
			router.events.off('routeChangeError', handleComplete)
		}
	}, [router])

	return loading ? <Loader /> : null
}

export default RouterLoader
