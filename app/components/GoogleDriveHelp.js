// Página de ayuda para configurar archivos de Google Drive
export default function GoogleDriveHelp() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Configuración de Archivos de Google Drive</h1>

      <h2>Para Audio y Video</h2>
      <ol>
        <li>Abre tu archivo en Google Drive</li>
        <li>Haz clic en "Compartir"</li>
        <li>Asegúrate de que esté configurado como "Cualquier persona con el enlace puede ver"</li>
        <li>Copia la URL completa del enlace compartido</li>
        <li>Pega esa URL en el formulario de agregar recurso</li>
      </ol>

      <h2>Solución de Problemas</h2>
      <p>Si el audio/video no se reproduce:</p>
      <ul>
        <li>Verifica que el archivo esté compartido públicamente</li>
        <li>Asegúrate de que la URL termine en "?usp=sharing"</li>
        <li>Intenta actualizar los permisos del archivo</li>
        <li>Si aún no funciona, el archivo se abrirá en Google Drive</li>
      </ul>

      <h2>URLs de Ejemplo</h2>
      <p>URL correcta: <code>https://drive.google.com/file/d/1ABC123.../view?usp=sharing</code></p>
      <p>URL incorrecta: <code>https://drive.google.com/file/d/1ABC123...</code></p>
    </div>
  )
}