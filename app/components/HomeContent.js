'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { convertGoogleDriveUrl, getGoogleDriveUrls, getMediaUrl, isEmbeddableUrl } from '../lib/utils'
import LogoutButton from './LogoutButton'

export default function HomeContent({ session, categories, recentResources }) {
  const { t } = useLanguage()

  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <LogoutButton />
      </div>

      <div className="card">
        <h2>{t('welcome')}, {session.user.name}</h2>
        <p>{t('role')}: {session.user.role}</p>
      </div>

      {session.user.role === 'admin' && (
        <div className="card">
          <h3>{t('adminPanel')}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/admin/users" className="btn">{t('manageUsers')}</a>
            <a href="/admin/content" className="btn">{t('manageContent')}</a>
            <a href="/admin/categories" className="btn">{t('manageCategories')}</a>
          </div>
        </div>
      )}

      <div className="card">
        <h3>{t('categories')}</h3>
        <div className="grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <p>{category.resources.length} {t('resources').toLowerCase()}</p>
              <a href={`/category/${category.id}`} className="btn">{t('resources')}</a>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{t('recentResources')}</h3>
        {recentResources.length === 0 ? (
          <p>{t('noResources')}</p>
        ) : (
          <div className="resources-grid">
            {recentResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <div className="resource-header">
                  <h4>{resource.title}</h4>
                  <span className="resource-type">{resource.type}</span>
                </div>
                <p className="resource-category">{resource.category.name}</p>
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
                          style={{ width: '100%', height: '150px', border: 'none', borderRadius: '4px' }}
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
                            style={{ width: '100%', maxHeight: '150px' }}
                            onError={(e) => {
                              console.log('Error loading video:', e.target.error, 'URL:', resource.url)
                              e.target.style.display = 'none'
                              const fallback = e.target.nextElementSibling
                              if (fallback) fallback.style.display = 'block'
                            }}
                          >
                            {getGoogleDriveUrls(resource.url).map((url, index) => (
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
                              {t('watchVideo')}
                            </a>
                          </div>
                        </>
                      )}
                      <a href={resource.url} target="_blank" className="btn btn-secondary" style={{ marginTop: '8px' }}>
                        {t('watchVideo')}
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