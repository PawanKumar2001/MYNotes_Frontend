import { useState, useEffect, useMemo } from 'react'
import { Search, StickyNote, X } from 'lucide-react'
import { fetchNotes } from '../../utils/api'
import NoteCard from './NoteCard'
import NoteCardSkeleton from './NoteCardSkeleton'
import toast from 'react-hot-toast'

const AllNotes = () => {
  const [notes,   setNotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const loadNotes = async () => {
    setLoading(true)
    try {
      const res = await fetchNotes()
      setNotes(res.data?.notes || res.data || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch notes.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNotes() }, [])

  // Frontend search
  const filtered = useMemo(() => {
    if (!search.trim()) return notes
    const q = search.toLowerCase()
    return notes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.notebody?.toLowerCase().includes(q)
    )
  }, [notes, search])

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id))
  }

  const handleUpdate = (id, updated) => {
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">

      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="input-field pl-10 pr-9"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Notes count */}
      {!loading && notes.length > 0 && (
        <p className="text-xs text-gray-400 mb-5">
          {search
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
            : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Skeleton grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state — no notes at all */}
      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
            <StickyNote className="text-primary-400 w-8 h-8" />
          </div>
          <h3 className="text-gray-700 font-medium text-lg mb-1">No notes yet</h3>
          <p className="text-gray-400 text-sm">Hit "Add a Note" to create your first one.</p>
        </div>
      )}

      {/* Empty state — search no results */}
      {!loading && notes.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Search className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-gray-700 font-medium text-lg mb-1">No results found</h3>
          <p className="text-gray-400 text-sm">Try a different search term.</p>
        </div>
      )}

      {/* Notes grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default AllNotes
