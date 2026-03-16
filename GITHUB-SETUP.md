# 🚀 Guía para Subir GOtool a GitHub

## Paso 1: Instalar Git

### Opción A: Git para Windows (Recomendado)
1. Descargar desde: https://git-scm.com/download/win
2. Ejecutar el instalador
3. Aceptar las opciones por defecto

### Opción B: GitHub Desktop
1. Descargar desde: https://desktop.github.com/
2. Instalar y configurar

## Paso 2: Configurar Git (Opcional pero recomendado)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## Paso 3: Ejecutar el Script de Subida
1. Abrir PowerShell como Administrador
2. Navegar a la carpeta del proyecto:
   ```powershell
   cd "C:\Users\Energy\Documents\GOtool"
   ```
3. Ejecutar el script:
   ```powershell
   .\setup-github.ps1
   ```

## ✅ Verificación
Después de ejecutar el script, verifica que el proyecto esté en:
**https://github.com/FrancoGimenezO/GOtool**

## 📝 Notas Importantes
- Asegúrate de tener conexión a internet
- Si hay errores de autenticación, Git te pedirá credenciales
- El script incluye un commit inicial con descripción completa del proyecto

## 🔧 Solución de Problemas
- Si `git` no se reconoce: Reinicia PowerShell después de instalar Git
- Si hay conflictos: El repositorio remoto podría tener archivos existentes
- Para forzar push: `git push -u origin main --force` (⚠️ Cuidado: sobrescribe el remoto)

¡El proyecto está listo para GitHub! 🎉