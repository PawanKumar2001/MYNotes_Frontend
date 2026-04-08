import { useState } from 'react'
import { Pencil, Trash2, Check, X, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteNote, updateNote } from '../../utils/api'

const NoteCard = ({ note, onDelete, onUpdate }) => {
  const [editing, setEditing]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving]     = useState(false)

  const [editForm, setEditForm] = useState({
    title:       note.title,
    description: note.description,
    notebody:    note.notebody,
  })

  const handleEditChange = (e) => {
    const { id, value } = e.target
    setEditForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateNote(note._id, {
        id:          note._id,
        title:       editForm.title.trim()       || 'Untitled',
        description: editForm.description.trim() || 'Untitled',
        notebody:    editForm.notebody.trim()     || 'Untitled',
        date:        note.date,
      })
      onUpdate(note._id, {
        ...note,
        title:       editForm.title.trim()       || 'Untitled',
        description: editForm.description.trim() || 'Untitled',
        notebody:    editForm.notebody.trim()     || 'Untitled',
      })
      toast.success('Note updated! ✏️')
      setEditing(false)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update note.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteNote(note._id)
      onDelete(note._id)
      toast.success('Note deleted.')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete note.'
      toast.error(msg)
      setDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm({
      title:       note.title,
      description: note.description,
      notebody:    note.notebody,
    })
    setEditing(false)
  }

  return (
    <div className={`card p-5 flex flex-col gap-3 animate-fadeIn
                     ${editing ? 'ring-2 ring-primary-300' : ''}`}>

      {editing ? (
        /* ── Edit mode ── */
        <div className="flex flex-col gap-3">
          <input
            id="title"
            type="text"
            value={editForm.title}
            onChange={handleEditChange}
            placeholder="Title"
            className="input-field text-sm font-medium"
          />
          <input
            id="description"
            type="text"
            value={editForm.description}
            onChange={handleEditChange}
            placeholder="Description"
            className="input-field text-sm"
          />
          <textarea
            id="notebody"
            rows={4}
            value={editForm.notebody}
            onChange={handleEditChange}
            placeholder="Note body"
            className="input-field text-sm resize-none"
          />

          {/* Edit actions */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600
                         hover:bg-primary-700 text-white text-xs font-medium py-2 rounded-xl
                         transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={13} />
              )}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200
                         text-gray-600 hover:bg-gray-50 text-xs font-medium py-2 rounded-xl
                         transition-all duration-200 active:scale-95"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <>
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-1">
            {note.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-primary-600 font-medium line-clamp-1">
            {note.description}
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Body */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
            {note.notebody}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              {note.date}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-xs text-primary-600 border border-primary-200
                           hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition-all duration-200
                           active:scale-95"
              >
                <Pencil size={11} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 text-xs text-red-500 border border-red-200
                           hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all duration-200
                           active:scale-95 disabled:opacity-50"
              >
                {deleting ? (
                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <Trash2 size={11} />
                )}
                {deleting ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NoteCard
