// review later

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../services/api'

const AdminCreateSubverse = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await Client.post('/subverses', { name, description })
      alert('✅ Subverse created successfully')
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create subverse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h2>Create New Subverse</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Subverse'}
        </button>
      </form>
    </div>
  )
}

export default AdminCreateSubverse