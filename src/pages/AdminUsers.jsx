import { useEffect, useState } from 'react'
import Client from '../services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])

  const loadUsers = async () => {
    const res = await Client.get('/auth/all-users')
    setUsers(res.data)
  }

  const toggleSuspend = async (id) => {
    await Client.patch(`/admin/suspend/${id}`)
    loadUsers()
  }

  useEffect(() => { loadUsers() }, [])

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h1>Users</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Reports</th>
            <th>Suspended</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.reportCount}</td>
              <td>{u.isSuspended ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggleSuspend(u._id)}>
                  {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers