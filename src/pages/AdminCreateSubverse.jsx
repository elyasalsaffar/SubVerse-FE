import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../services/api'

const AdminCreateSubverse = () => {
  const [subverseName, setSubverseName] = useState('')
  const [desc, setDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()
    setErrMsg('')
    setIsSubmitting(true)

    try {
      await Client.post('/subverses', { name: subverseName, description: desc })
      alert('✅ Subverse created successfully')
      navigate('/home')
    } catch (e) {
      setErrMsg(e?.response?.data?.msg || 'Failed to create subverse')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h2>Create New Subverse</h2>
      <form onSubmit={submitForm} style={{ maxWidth: 500 }}>
        <label>Name</label>
        <input
          value={subverseName}
          onChange={(e) => setSubverseName(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Subverse'}
        </button>
      </form>
    </div>
  )
}

export default AdminCreateSubverse