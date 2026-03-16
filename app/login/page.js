'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../contexts/LanguageContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })
    if (result.ok) {
      router.push('/')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>{t('login')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('email')}:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('password')}:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>{t('loginButton')}</button>
        </form>
      </div>
    </div>
  )
}