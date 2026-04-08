import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, NotebookPen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../utils/api'

// ─── Field validation ───────────────────────────────────────────────────────
const validate = (mode, form) => {
  const errors = {}

  if (mode === 'register') {
    if (!form.name.trim())
      errors.name = 'Name is required.'
    else if (form.name.trim().length < 3)
      errors.name = 'Name must be at least 3 characters.'
  }

  if (!form.email.trim())
    errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address.'

  if (!form.password)
    errors.password = 'Password is required.'
  else if (form.password.length < 8)
    errors.password = 'Password must be at least 8 characters.'

  if (mode === 'register' && form.password && form.confirmPassword !== undefined) {
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

// ─── Reusable Input ──────────────────────────────────────────────────────────
const InputField = ({ label, id, type = 'text', value, onChange, error, placeholder, rightElement }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${rightElement ? 'pr-10' : ''} ${
          error ? 'border-red-400 focus:ring-red-300' : ''
        }`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 animate-fadeIn">{error}</p>
    )}
  </div>
)

// ─── Main AuthPage ───────────────────────────────────────────────────────────
const AuthPage = () => {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }))
  }

  const switchMode = (newMode) => {
    if (newMode === mode) return
    setMode(newMode)
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setErrors({})
    setShowPassword(false)
    setShowConfirm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(mode, form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await loginUser({ email: form.email, password: form.password })
      } else {
        res = await registerUser({ name: form.name, email: form.email, password: form.password })
      }

      const token = res.data?.authorizationToken
      if (!token) throw new Error('No token received.')

      login(token)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created! 🎉')
      navigate('/allnotes', { replace: true })
    } catch (err) {
      const data = err.response?.data
      // Backend returns either { error: "string" } or { errors: [{msg, ...}] }
      const msg =
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
        (mode === 'login' ? 'Invalid email or password.' : 'Registration failed. Try again.')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col items-center justify-center p-12">

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -right-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-2">
            <NotebookPen className="text-white w-10 h-10" />
            <span className="font-logo text-white text-5xl tracking-wide">MYNotes</span>
          </div>
          <p className="text-primary-200 text-lg font-light leading-relaxed max-w-sm">
            Capture your thoughts, ideas, and everything in between — beautifully organised, always within reach.
          </p>

          {/* Decorative note cards */}
          <div className="mt-10 space-y-3">
            {[
              { title: '📌 Meeting Notes',  body: 'Discuss Q3 roadmap with the team...' },
              { title: '💡 Ideas',           body: 'Build a habit tracker app using...'  },
              { title: '📖 Reading List',    body: 'Atomic Habits, Deep Work, SICP...'  },
            ].map((note, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-left animate-fadeIn"
                style={{ animationDelay: `${i * 0.15 + 0.3}s`, opacity: 0 }}
              >
                <p className="text-white text-sm font-medium">{note.title}</p>
                <p className="text-primary-200 text-xs mt-0.5 truncate">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <NotebookPen className="text-primary-600 w-7 h-7" />
          <span className="font-logo text-primary-700 text-3xl">MYNotes</span>
        </div>

        <div className="w-full max-w-md animate-slideDown">

          {/* Toggle tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isLogin ? 'Welcome back 👋' : 'Create your account'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin
                ? 'Sign in to access your notes.'
                : 'Start organising your thoughts today.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name — register only */}
            {!isLogin && (
              <div className="animate-fadeIn">
                <InputField
                  label="Full Name"
                  id="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              </div>
            )}

            {/* Email */}
            <InputField
              label="Email Address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password */}
            <InputField
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
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

            {/* Confirm Password — register only */}
            {!isLogin && (
              <div className="animate-fadeIn">
                <InputField
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
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
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? 'register' : 'login')}
              className="text-primary-600 font-medium hover:underline"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
