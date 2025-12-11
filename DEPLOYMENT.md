# NUCLEUS Analytics - Deployment Guide

Este documento describe cómo hacer deployment del proyecto NUCLEUS Analytics en diferentes plataformas.

## 📦 Pre-requisitos

Antes de hacer deployment, asegúrate de:

1. ✅ Todos los archivos CSV están en `public/data/`
2. ✅ El proyecto compila sin errores: `npm run build`
3. ✅ Las dependencias están actualizadas: `npm install`
4. ✅ El código está en un repositorio Git

## 🚀 Opciones de Deployment

### 1. Vercel (Recomendado) ⭐

**Ventajas**: Deploy automático, CDN global, SSL gratis, preview deployments

#### Pasos

1. **Conectar repositorio**

   ```bash
   # Instalar Vercel CLI (opcional)
   npm i -g vercel
   
   # O usar la interfaz web: https://vercel.com
   ```

2. **Configuración automática**
   - Vercel detecta automáticamente que es un proyecto Vite
   - No necesitas configuración adicional

3. **Deploy**

   ```bash
   vercel
   # O push a main/master para deploy automático
   ```

4. **Variables de entorno** (si las necesitas)
   - Ve a Project Settings → Environment Variables
   - Agrega las variables necesarias

#### Configuración manual (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 2. Netlify

**Ventajas**: Fácil de usar, funciones serverless, forms integrados

#### Pasos

1. **Conectar repositorio**
   - Ve a <https://app.netlify.com>
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio Git

2. **Configuración**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Archivo de configuración** (netlify.toml)

   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Deploy**
   - Push a tu rama principal
   - Netlify hace deploy automáticamente

---

### 3. GitHub Pages

**Ventajas**: Gratis, integrado con GitHub

#### Pasos

1. **Instalar gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Actualizar package.json**

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://tu-usuario.github.io/nucleus-analytics-react"
   }
   ```

3. **Actualizar vite.config.js**

   ```javascript
   export default defineConfig({
     base: '/nucleus-analytics-react/', // Nombre de tu repo
     // ... resto de configuración
   })
   ```

4. **Deploy**

   ```bash
   npm run deploy
   ```

5. **Configurar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

---

### 4. Railway

**Ventajas**: Deployment continuo, bases de datos incluidas

#### Pasos

1. **Crear cuenta** en <https://railway.app>

2. **Nuevo proyecto**
   - Click "New Project"
   - Selecciona "Deploy from GitHub repo"

3. **Configuración**

   ```
   Build Command: npm run build
   Start Command: npm run preview
   ```

4. **Variables de entorno**
   - Agrega en el dashboard si es necesario

---

### 5. Render

**Ventajas**: SSL gratis, CDN, fácil configuración

#### Pasos

1. **Crear cuenta** en <https://render.com>

2. **Nuevo Static Site**
   - Click "New" → "Static Site"
   - Conecta tu repositorio

3. **Configuración**

   ```
   Build Command: npm run build
   Publish Directory: dist
   ```

4. **Deploy**
   - Render hace deploy automáticamente

---

## 🔧 Configuración Común

### Archivo .env.production

Si necesitas variables de entorno para producción:

```env
VITE_APP_TITLE=NUCLEUS Analytics
VITE_API_URL=https://api.nucleus.com
```

### Headers de Seguridad

Para Netlify, crea `public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Para Vercel, agrega a `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Limpia e instala de nuevo
rm -rf node_modules package-lock.json
npm install
```

### Error: "404 on page refresh"

- Asegúrate de tener configuradas las rewrites/redirects
- Todas las rutas deben apuntar a `index.html`

### CSVs no cargan en producción

1. Verifica que estén en `public/data/`
2. Revisa la consola del navegador
3. Verifica que el servidor sirva archivos estáticos correctamente

### Build muy grande

```bash
# Analiza el bundle
npm run build -- --mode production

# Considera lazy loading de componentes
# Usa dynamic imports para rutas
```

---

## 📊 Monitoreo Post-Deployment

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```javascript
// En main.jsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Google Analytics

```html
<!-- En index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## ✅ Checklist Pre-Deployment

- [ ] `npm run build` funciona sin errores
- [ ] `npm run preview` muestra la app correctamente
- [ ] Todos los CSVs están en `public/data/`
- [ ] `.gitignore` está configurado correctamente
- [ ] Variables de entorno configuradas (si aplica)
- [ ] README actualizado con URL de producción
- [ ] Tests pasando (si tienes)
- [ ] Performance optimizado (Lighthouse score > 90)

---

## 🔄 CI/CD Automático

### GitHub Actions (Ejemplo para Vercel)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📝 Notas Finales

- **Vercel** es la opción más fácil y rápida
- **Netlify** es excelente si necesitas forms o funciones
- **GitHub Pages** es gratis pero más limitado
- Todas las opciones ofrecen SSL y CDN gratis

**Recomendación**: Usa Vercel para empezar, es la más simple y potente.
