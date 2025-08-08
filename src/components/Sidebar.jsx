import { Link, useNavigate } from 'react-router-dom'

const Sidebar = ({ setUser }) => {
    const navigate = useNavigate()

    const handleLogOut =() => {
        localStorage.clear()
        setUser(null)
        navigate('/')
    }

    return (
        <div style={{ width: '200px', height: '100vh', background: '#f0f0f0', padding: '1rem', boxSizing: 'border-box', position: 'fixed', left: 0, top: 0 }}>
            <h3>SubVerse</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <Link to='/home'>🏠 Home</Link>
                <Link to='/profile'>👤 Profile</Link>
                <button onClick={handleLogOut} style={{ marginTop: 'auto' }}>🚪 Logout</button>
            </nav>
        </div>
    )
}

export default Sidebar