import Axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL

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