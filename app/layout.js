import './globals.css'
import { Providers } from './providers'
import Header from './components/Header'

export const metadata = {
  title: 'Sales Training Platform',
  description: 'Internal training platform for sales teams',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <Header />
          <main className="container">
            {children}
          </main>
        </Providers>
        <footer style={{ backgroundColor: '#f8f9fa', padding: '1rem', textAlign: 'center', marginTop: '2rem' }}>
          <p>&copy; 2026 Sales Training Platform</p>
        </footer>
      </body>
    </html>
  )
}