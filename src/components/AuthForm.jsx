import { useState } from "react"
import { SignInUser, RegisterUser } from "../services/Auth"
import { useNavigate } from "react-router-dom"

const AuthForm = ({ isLogin, setUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isLogin) {
                const user = await SignInUser({
                    email: formData.email,
                    password: formData.password
                })
                setUser(user)
                navigate('/home')
            } else {
                const data = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }
                await RegisterUser(data)
                alert('Account created. Please log in.')
            }
        } catch (error) {
            console.error('Auth error:', error.response?.data || error.message)
            setError('Something went wrong. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            {!isLogin && (
                <input 
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            )}
            <br />
            <input 
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
             />
            <br />
            <input 
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <br />
            <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}

export default AuthForm