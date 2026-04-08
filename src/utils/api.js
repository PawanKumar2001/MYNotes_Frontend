import axios from 'axios'

const BASE_URL = 'https://mynotes-backend-1xco.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authorization-token')
  if (token) {
    config.headers['authorization-token'] = token
  }
  return config
})

// Auth routes
export const loginUser    = (data) => api.post('/authorization/login', data)
export const registerUser = (data) => api.post('/authorization/createuser', data)

// Notes routes
export const fetchNotes  = ()     => api.get('/notes/fetchnotes')
export const addNote     = (data) => api.post('/notes/addnote', data)
export const deleteNote  = (id)   => api.delete(`/notes/deletenote/${id}`)
export const updateNote  = (id, data) => api.put(`/notes/updatenote/${id}`, data)

export default api
