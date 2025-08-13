import { useEffect, useState } from 'react'
import './App.css'
import { CheckSession } from './services/Auth'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import Sidebar from './components/Sidebar'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'
import PostDetails from './pages/PostDetails'
import CreatePost from './pages/CreatePost'
import MyPosts from './pages/MyPosts'
import AdminUsers from './pages/AdminUsers'
import AdminCreateSubverse from './pages/AdminCreateSubverse'

const App = () => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
    {user && <Sidebar setUser={setUser} />}
    <Routes>

      <Route path='/' element={user ? <Navigate to='/home' /> : <LandingPage setUser={setUser} />} />

      <Route path='/' element={<LandingPage setUser={setUser} />} />
      <Route path='/home' element={user ? <Layout><HomePage user={user} /></Layout> : <LandingPage setUser={setUser} />} />
      <Route path='/my-posts' element={user ? <MyPosts user={user} /> : <LandingPage setUser={setUser} />} />
      <Route path='/profile' element={user ? <Layout><ProfilePage user={user} /></Layout> : <LandingPage setUser={setUser} /> } />
      <Route path='/posts/:id' element={user ? <PostDetails user={user} /> : <LandingPage setUser={setUser} />} />
      <Route path='/create' element={user ? <CreatePost user={user} /> : <LandingPage setUser={setUser} />} />
      <Route path='/admin/users' element={user?.isAdmin ? <AdminUsers /> : <LandingPage setUser={setUser} />} />
      <Route path='/admin/create-subverse' element={user?.isAdmin ? <AdminCreateSubverse /> : <LandingPage setUser={setUser} />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
    </>
  )
}

export default App