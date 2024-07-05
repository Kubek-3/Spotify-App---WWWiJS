import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import RefreshTokenComponent from '@/components/others/RefreshTokenComponent'
import ReactQueryProvider from '@/utils/ReactQueryProvider'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'SpotifyApp',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</body>
		</html>
	)
}
