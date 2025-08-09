import { useState } from "react"
import { UpdatePassword } from "../services/Auth"

const ProfilePage = ({ user }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleChangePassword = async (e) => {
        e.preventDefault()
        try {
            await UpdatePassword(user.id, oldPassword, newPassword)
            setMessage('Password updated successfully!')
            setOldPassword('')
            setNewPassword('')
        } catch (error) {
            console.error(error)
            setMessage('Error updating password')
        }
    }

    return (
        <div>
            <h2>👤 Your Profile</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email</strong> {user?.email}</p>

            <form onSubmit={handleChangePassword} style={{ marginTop: '2rem' }}>
                <label>Old Password:</label>
                <input 
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
                <label>New Password:</label>
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Change Password</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    )
}

export default ProfilePage