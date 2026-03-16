'use client'

import { useState, useEffect, use } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../contexts/LanguageContext'
import { convertGoogleDriveUrl, getGoogleDriveUrls, getMediaUrl, isEmbeddableUrl } from '../../lib/utils'
import Link from 'next/link'

export default function CategoryPage({ params }) {
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { t } = useLanguage()
  const resolvedParams = use(params)
  const categoryId = resolvedParams.id

  useEffect(() => {
    async function checkAuthAndFetch() {
      const session = await getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const res = await fetch(`/api/categories/${categoryId}`)
      if (res.ok) {
        const data = await res.json()
        setCategory(data)
      } else {
        setCategory(null)
      }
      setLoading(false)
    }
    checkAuthAndFetch()
  }, [categoryId])

  if (loading) return <div>{t('loading')}</div>

  if (!category) {
    return <div>{t('categoryNotFound')}</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="btn">{t('backToHome')}</Link>
      </div>

      <div className="card">
        <h2>{category.name}</h2>
        <p>{category.description}</p>
      </div>

      <div className="card">
        <h3>{t('resources')}</h3>
        {category.resources.length === 0 ? (
          <p>{t('noResources')}</p>
        ) : (
          <div className="resources-grid">
            {category.resources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type}</span>
                </div>
                {resource.description && (
                  <p className="resource-description">{resource.description}</p>
                )}
                <div className="resource-preview">
                  {resource.type === 'document' && (
                    <div className="document-preview">
                      <div className="document-icon">
                        {resource.url.toLowerCase().includes('.pdf') ? '📕' :
                         resource.url.toLowerCase().includes('.doc') || resource.url.toLowerCase().includes('.docx') ? '📄' :
                         resource.url.toLowerCase().includes('.xls') || resource.url.toLowerCase().includes('.xlsx') ? '📊' :
                         resource.url.toLowerCase().includes('.ppt') || resource.url.toLowerCase().includes('.pptx') ? '📽️' :
                         '📄'}
                      </div>
                      <p className="document-info">
                        {resource.url.toLowerCase().includes('.pdf') ? 'Documento PDF' :
                         resource.url.toLowerCase().includes('.doc') || resource.url.toLowerCase().includes('.docx') ? 'Documento Word' :
                         resource.url.toLowerCase().includes('.xls') || resource.url.toLowerCase().includes('.xlsx') ? 'Hoja de cálculo' :
                         resource.url.toLowerCase().includes('.ppt') || resource.url.toLowerCase().includes('.pptx') ? 'Presentación' :
                         'Documento'}
                      </p>
                      <a href={resource.url} target="_blank" className="btn btn-primary">
                        {t('viewDocument')}
                      </a>
                    </div>
                  )}
                  {resource.type === 'video' && (
                    <div className="video-preview">
                      {isEmbeddableUrl(resource.url) ? (
                        // Para YouTube y otros servicios embeddables
                        <iframe
                          src={getMediaUrl(resource.url)[0]}
                          style={{ width: '100%', height: '200px', border: 'none', borderRadius: '4px' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`Video: ${resource.title}`}
                        />
                      ) : (
                        // Para videos directos (Google Drive, archivos locales, etc.)
                        <>
                          <video
                            controls
                            preload="metadata"
                            style={{ width: '100%', maxHeight: '200px' }}
                            onError={(e) => {
                              console.log('Error loading video:', e.target.error, 'URL:', resource.url)
                              e.target.style.display = 'none'
                              const fallback = e.target.nextElementSibling
                              if (fallback) fallback.style.display = 'block'
                            }}
                          >
                            {getMediaUrl(resource.url).map((url, index) => (
                              <source key={index} src={url} />
                            ))}
                            Tu navegador no soporta el elemento de video.
                          </video>
                          <div style={{ display: 'none', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginTop: '8px' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#856404' }}>
                              ⚠️ El video no se puede reproducir directamente. Posibles causas:
                            </p>
                            <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px', fontSize: '0.9em', color: '#856404' }}>
                              <li>El archivo no está compartido públicamente</li>
                              <li>Restricciones de CORS del navegador</li>
                              <li>Formato de archivo no soportado</li>
                            </ul>
                            <a href={resource.url} target="_blank" className="btn btn-secondary" style={{ marginTop: '8px' }}>
                              {t('watchVideo')} (Nueva ventana)
                            </a>
                          </div>
                        </>
                      )}
                      <a href={resource.url} target="_blank" className="btn btn-secondary" style={{ marginTop: '10px' }}>
                        {t('watchVideo')} (Nueva ventana)
                      </a>
                    </div>
                  )}
                  {resource.type === 'audio' && (
                    <div className="audio-preview">
                      <audio
                        controls
                        preload="metadata"
                        style={{ width: '100%' }}
                        onError={(e) => {
                          console.log('Error loading audio:', e.target.error, 'URL:', resource.url)
                          e.target.style.display = 'none'
                          const fallback = e.target.nextElementSibling
                          if (fallback) fallback.style.display = 'block'
                        }}
                        onLoadStart={() => console.log('Started loading audio:', resource.url)}
                        onCanPlay={() => console.log('Audio can play:', resource.url)}
                      >
                        {getGoogleDriveUrls(resource.url).map((url, index) => (
                          <source key={index} src={url} />
                        ))}
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                      <div style={{ display: 'none', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginTop: '8px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#856404' }}>
                          ⚠️ El audio no se puede reproducir directamente. Posibles causas:
                        </p>
                        <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px', fontSize: '0.9em', color: '#856404' }}>
                          <li>El archivo de Google Drive no está compartido públicamente</li>
                          <li>Restricciones de CORS del navegador</li>
                          <li>El archivo requiere autenticación</li>
                        </ul>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.9em' }}
                        >
                          Abrir en Google Drive
                        </a>
                      </div>
                    </div>
                  )}
                  {resource.type === 'image' && (
                    <div className="image-preview">
                      <img src={resource.url} alt={resource.title} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}