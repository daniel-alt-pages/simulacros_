# Quick Start Commands

## 🚀 Comandos Esenciales

### Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador: http://localhost:5173
```

### Build y Preview

```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview

# Abrir en navegador: http://localhost:4173
```

### Deploy

```bash
# Vercel
vercel

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy  # (después de configurar gh-pages)
```

### Mantenimiento

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ejecutar linter
npm run lint

# Ver tamaño del bundle
npm run build -- --mode production
```

## 📁 Archivos Importantes

- `README.md` - Documentación principal
- `DEPLOYMENT.md` - Guía de deployment
- `MIGRATION.md` - Detalles de migración Python → JS
- `SUMMARY.md` - Resumen ejecutivo del proyecto

## 🔧 Configuración Rápida

### Variables de Entorno (opcional)

```bash
# Crear .env.local
echo "VITE_APP_TITLE=NUCLEUS Analytics" > .env.local
```

### Git

```bash
# Inicializar (si no está inicializado)
git init
git add .
git commit -m "Initial commit - Production ready"

# Conectar a GitHub
git remote add origin https://github.com/tu-usuario/nucleus-analytics-react.git
git push -u origin main
```

## ⚡ Deploy en 3 Pasos

### Vercel

1. `git push origin main`
2. Conecta repo en vercel.com
3. ¡Listo! Deploy automático

### Netlify

1. `git push origin main`
2. Conecta repo en netlify.com
3. ¡Listo! Deploy automático

## 🐛 Solución Rápida de Problemas

```bash
# Build falla
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Puerto ocupado
# Cambiar puerto en vite.config.js o:
npm run dev -- --port 3000

# Limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev
```

## 📊 Verificación Rápida

```bash
# Verificar que todo funciona
npm install && npm run build && npm run preview
```

Si todo funciona, ¡estás listo para deploy! 🚀
