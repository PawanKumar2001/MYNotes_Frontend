import { PenLine, LayoutGrid } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Notebar = () => {
  const navigate  = useNavigate()
  const { pathname } = useLocation()

  const isAddNote  = pathname === '/addnote'
  const isAllNotes = pathname === '/allnotes'

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">

            <button
              onClick={() => navigate('/addnote')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200 active:scale-95
                          ${isAddNote
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                          }`}
            >
              <PenLine size={15} />
              Add a Note
            </button>

            <button
              onClick={() => navigate('/allnotes')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200 active:scale-95
                          ${isAllNotes
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                          }`}
            >
              <LayoutGrid size={15} />
              All Notes
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Notebar
