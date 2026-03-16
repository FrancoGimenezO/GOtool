'use client'

import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import Link from 'next/link'

export default function AdminContent() {
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingResource, setEditingResource] = useState(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession()
      if (!session || session.user.role !== 'admin') {
        router.push('/login')
        return
      }
      fetchResources()
      fetchCategories()
    }
    checkAuth()
  }, [])

  const fetchResources = async () => {
    const res = await fetch('/api/resources')
    const data = await res.json()
    setResources(data)
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  const handleCreateResource = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url')

    const resourceData = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      url: url,
      categoryId: parseInt(formData.get('categoryId')),
      permissions: formData.get('permissions') === 'admin' ? '{"roles": ["admin"]}' :
                   formData.get('permissions') === 'agent' ? '{"roles": ["agent"]}' :
                   '{"roles": ["admin", "agent"]}'
    }

    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resourceData)
    })

    if (res.ok) {
      alert(t('resourceCreated'))
      fetchResources()
      e.target.reset()
    } else {
      alert(t('errorCreatingResource'))
    }
  }

  const handleEditResource = (resource) => {
    setEditingResource(resource)
  }

  const handleUpdateResource = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get('url')

    const resourceData = {
      title: formData.get('title'),
      description: formData.get('description'),
      type: formData.get('type'),
      url: url,
      categoryId: parseInt(formData.get('categoryId')),
      permissions: formData.get('permissions') === 'admin' ? '{"roles": ["admin"]}' :
                   formData.get('permissions') === 'agent' ? '{"roles": ["agent"]}' :
                   '{"roles": ["admin", "agent"]}'
    }

    const res = await fetch(`/api/resources/${editingResource.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resourceData)
    })

    if (res.ok) {
      alert(t('resourceUpdated'))
      fetchResources()
      setEditingResource(null)
      e.target.reset()
    } else {
      alert(t('errorUpdatingResource'))
    }
  }

  const handleDeleteResource = async (resourceId) => {
    if (!confirm(t('confirmDelete'))) {
      return
    }

    const res = await fetch(`/api/resources/${resourceId}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      alert(t('resourceDeleted'))
      fetchResources()
    } else {
      alert(t('errorDeletingResource'))
    }
  }

  const handleCancelEdit = () => {
    setEditingResource(null)
  }

  if (loading) return <div>{t('loading')}</div>

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="btn">{t('backToHome')}</Link>
      </div>

      <div className="card">
        <h2>{t('manageContent')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>{t('title')}</th>
              <th>{t('type')}</th>
              <th>{t('category')}</th>
              <th>{t('permissions')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource.id}>
                <td>{resource.title}</td>
                <td>{resource.type}</td>
                <td>{resource.category.name}</td>
                <td>{resource.permissions}</td>
                <td>
                  <button className="btn" style={{ marginRight: '5px' }} onClick={() => handleEditResource(resource)}>{t('edit')}</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteResource(resource.id)}>{t('delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>{editingResource ? t('edit') + ' ' + t('resources') : t('addNewResource')}</h3>
        <form onSubmit={editingResource ? handleUpdateResource : handleCreateResource}>
          <div className="form-group">
            <label>{t('title')}:</label>
            <input type="text" name="title" placeholder={t('title')} defaultValue={editingResource?.title} required />
          </div>
          <div className="form-group">
            <label>{t('description')}:</label>
            <textarea name="description" placeholder={t('description')} defaultValue={editingResource?.description}></textarea>
          </div>
          <div className="form-group">
            <label>{t('type')}:</label>
            <select name="type" defaultValue={editingResource?.type}>
              <option value="document">{t('document')}</option>
              <option value="audio">{t('audio')}</option>
              <option value="video">{t('video')}</option>
              <option value="image">{t('image')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('url')}:</label>
            <input type="url" name="url" placeholder={t('url')} defaultValue={editingResource?.url} required />
            <small style={{ color: '#666', fontSize: '0.9em' }}>
              {t('urlHelp')}
              <br />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert(`Para archivos de Google Drive:\n\n1. Abre el archivo en Google Drive\n2. Haz clic en "Compartir"\n3. Configura como "Cualquier persona con el enlace puede ver"\n4. Copia la URL completa (con ?usp=sharing)\n5. Pega esa URL aquí\n\nSi no funciona, verifica los permisos del archivo.`)
                }}
                style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Ver instrucciones detalladas
              </a>
            </small>
          </div>
          <div className="form-group">
            <label>{t('category')}:</label>
            <select name="categoryId" defaultValue={editingResource?.categoryId} required>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{t('permissions')}:</label>
            <select name="permissions" defaultValue={
              editingResource?.permissions === '{"roles": ["admin"]}' ? 'admin' :
              editingResource?.permissions === '{"roles": ["agent"]}' ? 'agent' : 'both'
            }>
              <option value="both">{t('allUsers')}</option>
              <option value="admin">{t('adminOnly')}</option>
              <option value="agent">{t('agentOnly')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn">
              {editingResource ? t('edit') : t('addResource')}
            </button>
            {editingResource && (
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