import axios from 'axios'

// In local development, defaults to localhost:8010.
// On Vercel, defaults to '/api' on the same domain (or custom VITE_API_URL if provided).
const defaultBaseURL = import.meta.env.DEV ? 'http://localhost:8010' : '/api'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api
