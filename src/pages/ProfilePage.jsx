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

    // review later

     return (
        <div style={{
            maxWidth: "500px",
            margin: "2rem auto",
            padding: "1.5rem",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>👤 Your Profile</h2>

            <p style={{ marginBottom: "0.5rem" }}>
                <strong>Username:</strong> {user?.username}
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
                <strong>Email:</strong> {user?.email}
            </p>

            <form onSubmit={handleChangePassword} style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <label style={{ fontWeight: "bold" }}>Old Password:</label>
                <input 
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "1rem"
                    }}
                />

                <label style={{ fontWeight: "bold" }}>New Password:</label>
                <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "1rem"
                    }}
                />

                <button type="submit" style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "0.7rem",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
                onMouseOut={(e) => e.target.style.background = "#2563eb"}
                >
                    Change Password
                </button>
            </form>

            {message && (
                <p style={{
                    marginTop: "1.5rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: message.includes("✅") ? "green" : "red"
                }}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default ProfilePage