import { LogOut, NotebookPen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const Navbar = () => {
  const navigate = useNavigate()
  const { logout, getUsername } = useAuth()
  const username = getUsername()

  const handleLogout = () => {
    logout()
    toast.success('Logged out. See you soon! 👋')
    navigate('/auth', { replace: true })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <NotebookPen className="text-primary-600 w-6 h-6" />
          <span className="font-logo text-primary-700 text-2xl tracking-wide">MYNotes</span>
        </div>

        {/* Greeting + Logout */}
        <div className="flex items-center gap-4">
          <p className="hidden sm:block text-sm text-gray-500">
            {getGreeting()},{' '}
            <span className="font-medium text-primary-700">{username}</span>
          </p>

          {/* Mobile: just username */}
          <p className="sm:hidden text-sm font-medium text-primary-700">{username}</p>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500
                       border border-gray-200 hover:border-red-200 hover:bg-red-50
                       px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
