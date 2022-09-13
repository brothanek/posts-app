import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { IntlProvider } from 'react-intl'
import RouterLoader from '@components/RouterLoader'
import { AuthProvider } from '@contexts/AuthContext'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<IntlProvider locale="en-US">
			<AuthProvider>
				<Toaster />
				<Component {...pageProps} />
				<RouterLoader />
			</AuthProvider>
		</IntlProvider>
	)
}

export default MyApp
