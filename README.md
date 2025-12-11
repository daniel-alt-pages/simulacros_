# NUCLEUS Analytics React

Sistema de análisis educativo basado en React + Vite que procesa datos de minisimulacros ICFES.

## 🚀 Características

- **Procesamiento Dinámico de CSVs**: Los archivos CSV se procesan directamente en el navegador, eliminando la necesidad de scripts Python y JSONs intermedios
- **Dashboard de Estudiantes**: Visualización detallada de rendimiento por área
- **Dashboard de Administrador**: Análisis psicométrico de preguntas y estadísticas globales
- **Algoritmo NUCLEUS V10**: Scoring no-lineal inspirado en ICFES
- **Análisis de Rachas**: Detección de patrones de consistencia
- **Responsive Design**: Interfaz moderna con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd nucleus-analytics-react

# Instalar dependencias
npm install
```

## 📁 Estructura de Datos

Los archivos CSV deben estar en `public/data/` con los siguientes nombres:

- `CENTRALIZADOR DE DATOS - 1. MATEMÁTICAS.csv`
- `CENTRALIZADOR DE DATOS - 2. LECTURA CRÍTICA.csv`
- `CENTRALIZADOR DE DATOS - 3. CIENCIAS NATURALES.csv`
- `CENTRALIZADOR DE DATOS - 4. SOCIALES Y CIUDADANAS.csv`
- `CENTRALIZADOR DE DATOS - 5. INGLÉS.csv`

### Formato CSV Esperado

Cada CSV debe tener las siguientes columnas:

- `ID`: Identificador único del estudiante
- `NOMBRE`: Nombre completo del estudiante
- `P1`, `P2`, ..., `P25`: Respuestas a cada pregunta (A, B, C, D)
- `FB_P1`, `FB_P2`, ..., `FB_P25`: Feedback de cada pregunta (✅ para correcta)
- `PUNTUACIÓN`: (Opcional) Formato "correctas/total" (ej: "20/25")

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:5173
```

## 🏗️ Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

## 📦 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy automático en cada push

### Netlify

1. Conecta tu repositorio a Netlify
2. Configuración:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Deploy automático

### GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar a package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 🔧 Configuración

### Vite Config

El proyecto usa Vite con las siguientes configuraciones:

- React plugin para Fast Refresh
- Build optimizado con charset UTF-8
- Soporte para archivos CSV en public/

### Variables de Entorno

Crea un archivo `.env.local` si necesitas configuraciones personalizadas:

```env
VITE_APP_TITLE=NUCLEUS Analytics
VITE_API_URL=https://tu-api.com
```

## 📊 Arquitectura

```
src/
├── components/          # Componentes React reutilizables
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   └── ...
├── services/           # Lógica de negocio
│   ├── csvProcessor.js      # Procesamiento de CSVs (migrado de Python)
│   ├── dataService.js       # Servicio de datos
│   ├── analyticsEngine.js   # Motor de análisis
│   └── classificationService.js
├── hooks/              # Custom React hooks
├── App.jsx            # Componente principal
└── main.jsx           # Entry point

public/
└── data/              # Archivos CSV de datos
```

## 🔄 Migración de Python a JavaScript

Este proyecto **ya no requiere** scripts Python. Toda la lógica de procesamiento se ha migrado a JavaScript:

- ❌ ~~`scripts/generate-json-from-csv.py`~~ → ✅ `src/services/csvProcessor.js`
- ❌ ~~`scripts/fix-encoding.js`~~ → Eliminado (innecesario)
- ❌ ~~`public/NUCLEUS_WEB_DB.json`~~ → Generado dinámicamente en memoria

### Ventajas de la Migración

1. **Sin dependencias Python**: Solo necesitas Node.js
2. **Procesamiento en tiempo real**: Los CSVs se procesan al cargar la app
3. **Menor tamaño de repositorio**: No se generan JSONs intermedios
4. **Más fácil de mantener**: Todo en un solo lenguaje
5. **Deploy simplificado**: Sin necesidad de pre-procesamiento

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecuta ESLint

## 🐛 Troubleshooting

### Los datos no cargan

1. Verifica que los CSVs estén en `public/data/`
2. Revisa la consola del navegador para errores
3. Asegúrate que los CSVs tengan el formato correcto

### Error de encoding

Los CSVs deben estar en UTF-8. Si tienes problemas:

1. Abre el CSV en un editor de texto
2. Guarda como UTF-8 (sin BOM)

### Build falla

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

Proyecto educativo - NUCLEUS Analytics

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Nota**: Este proyecto ha sido completamente migrado de Python a JavaScript para facilitar el deployment y mantenimiento. Ya no se requieren scripts de pre-procesamiento.
