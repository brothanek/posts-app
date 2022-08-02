import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navigation from '@components/Navigation'
import { AuthProvider } from 'contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Navigation />
			<Toaster />
			<Component {...pageProps} />
		</AuthProvider>
	)
}

export default MyApp
