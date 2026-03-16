'use client'

import { signOut } from 'next-auth/react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LogoutButton() {
  const { t } = useLanguage()

  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-danger">
      {t('logout')}
    </button>
  )
}