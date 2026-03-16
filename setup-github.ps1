# Script para inicializar Git y subir a GitHub
# Ejecutar este script después de instalar Git

Write-Host "Inicializando repositorio Git..." -ForegroundColor Green

# Inicializar repositorio
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: Sales Training Platform GOtool

- Next.js 15 application with App Router
- Prisma ORM with SQLite database
- NextAuth.js authentication with role-based access
- Multimedia content management (videos, audio, documents)
- Dark/Light theme toggle with animations
- Multi-language support (Spanish/Brazilian Portuguese)
- Responsive design with modern UI"

# Configurar repositorio remoto
git branch -M main
git remote add origin https://github.com/FrancoGimenezO/GOtool.git

# Subir a GitHub
Write-Host "Subiendo a GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "¡Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
Write-Host "URL: https://github.com/FrancoGimenezO/GOtool" -ForegroundColor Cyan