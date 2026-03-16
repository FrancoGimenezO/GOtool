'use client'

import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import Link from 'next/link'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession()
      if (!session || session.user.role !== 'admin') {
        router.push('/login')
        return
      }
      fetchUsers()
    }
    checkAuth()
  }, [])

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    }

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    if (res.ok) {
      alert(t('userCreated'))
      fetchUsers()
      e.target.reset()
    } else {
      alert(t('errorCreatingUser'))
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password') || undefined, // Only include if provided
      role: formData.get('role')
    }

    const res = await fetch(`/api/users/${editingUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    if (res.ok) {
      alert(t('userUpdated'))
      fetchUsers()
      setEditingUser(null)
      e.target.reset()
    } else {
      alert(t('errorUpdatingUser'))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm(t('confirmDeleteUser'))) {
      return
    }

    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      alert(t('userDeleted'))
      fetchUsers()
    } else {
      alert(t('errorDeletingUser'))
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  if (loading) return <div>{t('loading')}</div>

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="btn">{t('backToHome')}</Link>
      </div>

      <div className="card">
        <h2>{t('manageUsers')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('email')}</th>
              <th>{t('role')}</th>
              <th>{t('created')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? t('admin') : t('agent')}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger" style={{ marginRight: '5px' }} onClick={() => handleEditUser(user)}>{t('edit')}</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>{t('delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>{editingUser ? t('edit') + ' ' + t('name').toLowerCase() : t('addNewUser')}</h3>
        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
          <div className="form-group">
            <label>{t('name')}:</label>
            <input type="text" name="name" placeholder={t('name')} defaultValue={editingUser?.name} required />
          </div>
          <div className="form-group">
            <label>{t('email')}:</label>
            <input type="email" name="email" placeholder={t('email')} defaultValue={editingUser?.email} required />
          </div>
          <div className="form-group">
            <label>{t('password')}:</label>
            <input type="password" name="password" placeholder={editingUser ? t('password') + ' (' + t('optional') + ')' : t('password')} required={!editingUser} />
          </div>
          <div className="form-group">
            <label>{t('role')}:</label>
            <select name="role" defaultValue={editingUser?.role}>
              <option value="agent">{t('agent')}</option>
              <option value="admin">{t('admin')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn">
              {editingUser ? t('edit') : t('addUser')}
            </button>
            {editingUser && (
              <button type="button" className="btn" onClick={handleCancelEdit}>
                {t('cancel')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}