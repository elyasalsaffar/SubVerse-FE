import { useState } from "react"
import AuthForm from '../components/AuthForm'

const LandingPage = ({ setUser }) => {
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div className="landing-page">
            <h1>Welcome to SubVerse</h1>
            <p>Join and start posting today!</p>

            <div style={{ marginTop: '20px' }}>
                <button onClick={() => setShowLogin(true)} disabled={showLogin}>
                    Login
                </button>
                <button onClick={() => setShowLogin(false)} disabled={!showLogin}>
                    Sign Up
                </button>
            </div>
            <AuthForm isLogin={showLogin} setUser={setUser} />
        </div>
    )
}

export default LandingPage