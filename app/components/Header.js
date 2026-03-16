'use client'

import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function Header() {
  const { isDark, setIsDark } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="header-title">{t('salesTrainingPlatform')}</h1>
        <div className="header-controls">
          <label htmlFor="theme" className="theme">
            <span className="theme__toggle-wrap">
              <input
                id="theme"
                className="theme__toggle"
                type="checkbox"
                role="switch"
                name="theme"
                value="dark"
                checked={isDark}
                onChange={(e) => setIsDark(e.target.checked)}
              />
              <span className="theme__fill"></span>
              <span className="theme__icon">
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
                <span className="theme__icon-part"></span>
              </span>
            </span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="es">{t('spanish')}</option>
            <option value="pt">{t('portuguese')}</option>
          </select>
        </div>
      </div>
    </header>
  )
}