import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@material-tailwind/react'
import { IntlProvider } from 'react-intl'
import { AuthProvider } from '@contexts/AuthContext'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<IntlProvider locale="en-US">
			<ThemeProvider>
				<AuthProvider>
					<Toaster />
					<Component {...pageProps} />
				</AuthProvider>
			</ThemeProvider>
		</IntlProvider>
	)
}

export default MyApp
