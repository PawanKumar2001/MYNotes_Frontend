import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Notebar from '../components/home/Notebar'
import AddNote from '../components/home/AddNote'
import AllNotes from '../components/home/AllNotes'
import Footer from '../components/home/Footer'

const HomePage = () => {
  const { pathname } = useLocation()
  const navigate     = useNavigate()

  // Default to /allnotes if landing on bare /
  useEffect(() => {
    if (pathname === '/' || pathname === '') {
      navigate('/allnotes', { replace: true })
    }
  }, [pathname, navigate])

  const showAddNote  = pathname === '/addnote'
  const showAllNotes = pathname === '/allnotes'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Notebar />

      <main className="flex-1">
        {showAddNote  && <AddNote />}
        {showAllNotes && <AllNotes />}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
