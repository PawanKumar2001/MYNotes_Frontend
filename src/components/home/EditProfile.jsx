import { useState } from 'react'
import { Eye, EyeOff, UserCog, KeyRound, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

// ─── Validation ──────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {}

  if (form.name && form.name.trim().length < 3)
    errors.name = 'Name must be at least 3 characters.'

  if (form.password && form.password.length < 8)
    errors.password = 'Password must be at least 8 characters.'

  if (form.password && form.confirmPassword !== form.password)
    errors.confirmPassword = 'Passwords do not match.'

  if (!form.name.trim() && !form.password)
    errors.general = 'Please update at least one field.'

  return errors
}

// ─── Input field ─────────────────────────────────────────────────────────────
const InputField = ({ label, id, type = 'text', value, onChange, error, placeholder, rightElement, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${rightElement ? 'pr-10' : ''} ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500 animate-fadeIn">{error}</p>}
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const EditProfile = () => {
  const navigate    = useNavigate()
  const { login, getUsername } = useAuth()
  const currentName = getUsername()

  const [loading, setLoading]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [errors, setErrors]             = useState({})

  const [form, setForm] = useState({
    name:            '',
    password:        '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (errors[id])      setErrors((prev) => ({ ...prev, [id]: '' }))
    if (errors.general)  setErrors((prev) => ({ ...prev, general: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {}
      if (form.name.trim())  payload.name     = form.name.trim()
      if (form.password)     payload.password = form.password

      const res   = await updateUser(payload)
      const token = res.data?.authorizationToken
      if (!token) throw new Error('No token received.')

      // Replace stored token with fresh one (has updated name)
      login(token)
      toast.success('Profile updated! ✅')
      navigate('/allnotes')
    } catch (err) {
      const data = err.response?.data
      const msg  =
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
        'Failed to update profile. Try again.'
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
            <UserCog className="text-primary-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
            <p className="text-xs text-gray-400">Leave a field blank to keep it unchanged</p>
          </div>
        </div>

        {/* Current name badge */}
        <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-6">
          <User size={14} className="text-primary-500" />
          <p className="text-sm text-primary-700">
            Logged in as <span className="font-semibold">{currentName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* General error */}
          {errors.general && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 animate-fadeIn">
              {errors.general}
            </p>
          )}

          {/* New name */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User size={11} /> Username
            </p>
            <InputField
              label="New Username"
              id="name"
              placeholder="Enter new username..."
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              hint="Minimum 3 characters"
            />
          </div>

          <div className="h-px bg-gray-100" />

          {/* New password */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <KeyRound size={11} /> Password
            </p>
            <div className="space-y-4">
              <InputField
                label="New Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password..."
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                hint="Minimum 8 characters"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <InputField
                label="Confirm New Password"
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password..."
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UserCog size={15} />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/allnotes')}
              className="btn-ghost flex items-center justify-center gap-2"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProfile
