import { Outlet, useLocation } from 'react-router-dom'
import { Background } from './Background'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const location = useLocation()
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Background />
      <Navbar />
      <main key={location.pathname} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
