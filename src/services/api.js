import Axios from 'axios'

// Automatically pick localhost in dev, Render URL in production
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3001'
    : 'https://subverse.onrender.com')

const Client = Axios.create({ baseURL: BASE_URL })

Client.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`
    }
    return config
  },
  async (error) => {
    console.log({ msg: 'Axios Interceptor Error!', error })
    throw error
  }
)

export default Client