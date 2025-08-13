import { Link, useNavigate } from 'react-router-dom'

const Sidebar = ({ setUser }) => {
    const navigate = useNavigate()

    const handleLogOut =() => {
        localStorage.clear()
        setUser(null)
        navigate('/')
    }

    return (
        <div style={{ 
            width: '200px',
            height: '100vh',
            background: '#111827',
            color: 'white',
            padding: '1rem',
            boxSizing: 'border-box',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column'
         }}>
            <h3>SubVerse</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <Link to='/home' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>🏠 Home</Link>
                <Link to='/my-posts' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>📝 My Posts</Link>
                <Link to='/create' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>➕ Create</Link>
                {localStorage.getItem('token') && JSON.parse(atob(localStorage.getItem('token').split('.')[1])).isAdmin && (
                    <>
                    <Link to='/admin/users' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>👥 Users</Link>
                    <Link to='/admin/create-subverse' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>🌌 Create Subverse</Link>
                    </>
                )}
                <Link to='/profile' style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}>👤 Profile</Link>
                <button onClick={handleLogOut} style={{ marginTop: 'auto' }}>🚪 Logout</button>
            </nav>
        </div>
    )
}

export default Sidebar