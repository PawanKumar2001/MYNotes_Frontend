import { useState } from 'react'
import { PenLine, AlignLeft, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { addNote } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

const AddNote = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', notebody: '' })

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title:       form.title.trim()       || 'Untitled',
      description: form.description.trim() || 'Untitled',
      notebody:    form.notebody.trim()     || 'Untitled',
      date:        new Date().toLocaleDateString('en-IN', {
                     day: '2-digit', month: 'short', year: 'numeric',
                   }),
    }

    try {
      await addNote(payload)
      toast.success('Note added! 📝')
      setForm({ title: '', description: '', notebody: '' })
      navigate('/allnotes')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add note. Try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">

      <div className="card p-6 sm:p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <PenLine className="text-primary-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">New Note</h2>
            <p className="text-xs text-gray-400">What's on your mind?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <PenLine size={13} className="text-primary-400" /> Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Note title..."
              className="input-field"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-primary-400" /> Description
            </label>
            <input
              id="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description..."
              className="input-field"
            />
          </div>

          {/* Note Body */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notebody" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <BookOpen size={13} className="text-primary-400" /> Note Body
            </label>
            <textarea
              id="notebody"
              rows={6}
              value={form.notebody}
              onChange={handleChange}
              placeholder="Write your note here..."
              className="input-field resize-none"
            />
          </div>

          {/* Date preview */}
          <p className="text-xs text-gray-400">
            📅 {' '}
            <span className="text-gray-500 font-medium">
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </span>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <PenLine size={15} />
                Save Note
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddNote
