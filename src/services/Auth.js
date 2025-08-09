import Client from './api'

export const RegisterUser = async (data) => {
  try {
    const res = await Client.post('/auth/register', data)
    return res.data
  } catch (error) {
    throw error
  }
}

export const SignInUser = async (data) => {
  try {
    const res = await Client.post('/auth/login', data)
    if (res.status === 200 && res.data?.token) {
      localStorage.setItem('token', res.data.token)
      return res.data.user
    }
    throw new Error('Invalid login response')
  } catch (error) {
    // Ensure token isn't stored on failed login
    localStorage.removeItem('token')
    throw error
  }
}


export const UpdatePassword = async (userId, oldPassword, newPassword) => {
  try {
    const res = await Client.put(`/auth/update/${userId}`, {
      oldPassword,
      newPassword
    })
    return res.data
  } catch (error) {
    throw error
  }
}

export const CheckSession = async () => {
  try {
    const res = await Client.get('/auth/session')
    return res.data
  } catch (error) {
    throw error
  }
}