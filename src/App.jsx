import { use, useEffect, useState } from 'react'
import './App.css'
import { CheckSession } from './services/Auth'

const App = () => {

  const [user, setUser] = useState(null)

  const location = useLocation()

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

  const checkToken = async () => {
    try {
      const user = await CheckSession()
      setUser(user)
    } catch (error) {
      console.error('Session check failed: ', error)
      localStorage.removeItem('token')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <>
      <h1>Hello World</h1>
      <p>😊</p>
    </>
  )
}

export default App