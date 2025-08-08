import { use, useEffect, useState } from 'react'
import './App.css'
import { CheckSession } from './services/Auth'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import Sidebar from './components/Sidebar'
import ProfilePage from './pages/ProfilePage'

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
  }, [user])

  return (
    <>
    {user && <Sidebar setUser={setUser} />}
    <Routes>
      <Route path='/' element={<LandingPage setUser={setUser} />} />
      <Route path='/home' element={user ? <HomePage user={user} /> : <LandingPage setUser={setUser} />} />
      <Route path='/profile' element={user ? <ProfilePage user={user} /> : <LandingPage setUser={setUser} /> } />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
    </>
  )
}

export default App