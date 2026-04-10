import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/home/Navbar'
import Notebar from '../components/home/Notebar'
import AddNote from '../components/home/AddNote'
import AllNotes from '../components/home/AllNotes'
import EditProfile from '../components/home/EditProfile'
import Footer from '../components/home/Footer'

const HomePage = () => {
  const { pathname } = useLocation()
  const navigate     = useNavigate()

  useEffect(() => {
    if (pathname === '/') {
      navigate('/allnotes', { replace: true })
    }
  }, [pathname, navigate])

  const showAddNote     = pathname === '/addnote'
  const showAllNotes    = pathname === '/allnotes'
  const showEditProfile = pathname === '/editprofile'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Notebar hidden on edit profile — it sits outside the note flow */}
      {!showEditProfile && <Notebar />}

      <main className="flex-1">
        {showAddNote     && <AddNote />}
        {showAllNotes    && <AllNotes />}
        {showEditProfile && <EditProfile />}
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
