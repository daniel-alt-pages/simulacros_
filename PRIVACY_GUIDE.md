# 🔐 NUCLEUS Analytics - Sistema de Privacidad Multinivel

## 📚 Guía Completa de Uso

---

## 🎯 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Uso Diario](#uso-diario)
3. [Niveles de Protección](#niveles-de-protección)
4. [Comandos Rápidos](#comandos-rápidos)
5. [Configuración en Vercel](#configuración-en-vercel)
6. [Debugging](#debugging)
7. [Personalización](#personalización)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Configuración Inicial

### Paso 1: Crear Archivos de Entorno

Crea **DOS archivos** en la raíz del proyecto:

#### `.env.development` (Para desarrollo local)

```bash
# 🔓 MODO DESARROLLO - Todo visible
VITE_ENABLE_CONSOLE_LOGS=true
VITE_ENCRYPT_LOGS=false
VITE_ENABLE_DEVTOOLS=true
VITE_DETECT_DEVTOOLS=false
VITE_PROTECT_RIGHT_CLICK=false
VITE_DISABLE_TEXT_SELECTION=false
VITE_ADMIN_DEBUG_KEY=Ctrl+Shift+Alt+D
VITE_SECURITY_MODE=development
```

#### `.env.production` (Para Vercel/producción)

```bash
# 🔒 MODO PRODUCCIÓN - Todo protegido
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENCRYPT_LOGS=true
VITE_ENABLE_DEVTOOLS=false
VITE_DETECT_DEVTOOLS=true
VITE_PROTECT_RIGHT_CLICK=true
VITE_DISABLE_TEXT_SELECTION=true
VITE_ADMIN_DEBUG_KEY=Ctrl+Shift+Alt+D
VITE_SECURITY_MODE=production
```

### Paso 2: Copiar desde el Ejemplo

```bash
# Copia el archivo de ejemplo
cp .env.example .env.development
cp .env.example .env.production

# Luego edita cada uno según las configuraciones de arriba
```

---

## 🛠️ Uso Diario

### Desarrollo Local Normal

```bash
npm run dev
```

✅ **Resultado:**

- Ves TODOS los logs en consola
- DevTools funcionan perfectamente
- Click derecho habilitado
- Puedes inspeccionar elementos
- localStorage sin encriptar

**No cambia NADA de tu flujo actual** 🎉

---

### Probar Modo Producción Localmente

```bash
npm run build
npm run preview
```

🔒 **Resultado:**

- Logs desaparecen o se encriptan
- DevTools bloqueados
- localStorage encriptado
- Click derecho deshabilitado

**Para volver a desarrollo:**

```bash
Ctrl+C  # Detener preview
npm run dev
```

---

### Activar Debug en Producción (Solo Admin)

Cuando estés en **producción** (Vercel) y necesites ver logs:

1. Abre la aplicación en producción
2. Presiona: **Ctrl + Shift + Alt + D**
3. Aparece notificación: "🔓 Modo Debug Activado"
4. Ahora ves logs descifrados

**Para desactivar:**

- Presiona nuevamente: **Ctrl + Shift + Alt + D**
- O recarga la página

---

## 🔐 Niveles de Protección

### Nivel 1: Logs de Consola

| Variable | Valor | Efecto |
|----------|-------|--------|
| `VITE_ENABLE_CONSOLE_LOGS` | `true` | Logs normales visibles |
| `VITE_ENABLE_CONSOLE_LOGS` | `false` | Logs silenciados |
| `VITE_ENCRYPT_LOGS` | `true` | Logs encriptados |

**Uso en código:**

```javascript
// ❌ ANTES (inseguro):
console.log('🔑 Claves cargadas:', answerKeys);

// ✅ DESPUÉS (seguro):
import logger from '@/utils/secureLogger';
logger.log('🔑 Claves cargadas:', answerKeys);

// En desarrollo → Se ve normal
// En producción → Silenciado o encriptado
```

---

### Nivel 2: DevTools

| Variable | Valor | Efecto |
|----------|-------|--------|
| `VITE_DETECT_DEVTOOLS` | `true` | Detecta apertura de DevTools |
| `VITE_DETECT_DEVTOOLS` | `false` | No detecta |

**Comportamiento:**

```
Usuario abre DevTools (F12)
→ Se detecta
→ Aparece advertencia: "⚠️ Acceso no autorizado detectado"
→ Se registra el intento
```

---

### Nivel 3: Click Derecho

| Variable | Valor | Efecto |
|----------|-------|--------|
| `VITE_PROTECT_RIGHT_CLICK` | `true` | Click derecho deshabilitado |
| `VITE_PROTECT_RIGHT_CLICK` | `false` | Click derecho normal |

**Excepciones:**

- Admin puede hacer click derecho con `Ctrl+Click`
- En modo debug está habilitado

---

### Nivel 4: localStorage Encriptado

**Automático según entorno**. No necesitas configurar nada.

```javascript
// ❌ ANTES (inseguro):
localStorage.setItem('userData', JSON.stringify(user));
// → Cualquiera puede leer: localStorage.getItem('userData')

// ✅ DESPUÉS (seguro):
import { secureStorage } from '@/utils/encryption';
secureStorage.set('userData', user);
// → Encriptado: "U2FsdGVkX1+Zx8vK3..."
```

---

## 🎮 Comandos Rápidos

| Acción | Comando | Resultado |
|--------|---------|-----------|
| Desarrollo normal | `npm run dev` | Todo visible |
| Probar producción | `npm run build && npm run preview` | Todo protegido |
| Activar debug en producción | `Ctrl+Shift+Alt+D` | Logs visibles (solo admin) |
| Cambiar a modo seguro | Editar `.env.development` | Personalizar protecciones |

---

## 📋 Configuración en Vercel

### Paso 1: Variables de Entorno

1. Ve a tu proyecto en **Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. Agrega estas variables:

```
VITE_ENABLE_CONSOLE_LOGS = false
VITE_ENABLE_DEVTOOLS = false
VITE_ENCRYPT_LOGS = true
VITE_PROTECT_RIGHT_CLICK = true
VITE_DETECT_DEVTOOLS = true
VITE_ADMIN_DEBUG_KEY = Ctrl+Shift+Alt+D
VITE_SECURITY_MODE = production
```

### Paso 2: Redeploy

```bash
git add .
git commit -m "feat: Sistema de privacidad multinivel"
git push origin main
```

Vercel automáticamente usa las variables de producción ✅

---

## 🔍 Debugging

### Ver Logs Encriptados en Producción

```javascript
// Los logs se ven así en consola:
"🔐 U2FsdGVkX1+Zx8vK3pqR7w=="

// Para descifrar:
1. Presiona Ctrl+Shift+Alt+D
2. Los logs se descifran automáticamente en consola
```

### Exportar Historial de Logs

```javascript
// En consola del navegador (modo debug activado):
import logger from '@/utils/secureLogger';
logger.export();
// → Descarga archivo JSON con todos los logs
```

### Ver Intentos de Seguridad

```javascript
import devToolsProtection from '@/utils/devToolsProtection';
devToolsProtection.getSecurityEvents();

// Resultado:
[
  { 
    event: "devtools_opened", 
    timestamp: "2024-12-14T01:30:00Z",
    userAgent: "..." 
  },
  { 
    event: "right_click_blocked", 
    timestamp: "2024-12-14T01:31:00Z" 
  }
]
```

---

## ⚙️ Personalización Avanzada

### Cambiar Combinación de Teclas

```bash
# En .env.production
VITE_ADMIN_DEBUG_KEY=Alt+S+G  # Tu combinación preferida
```

### Activar Solo Algunas Protecciones

```bash
# Ejemplo: Solo encriptar logs, pero permitir DevTools
VITE_ENABLE_CONSOLE_LOGS=true
VITE_ENCRYPT_LOGS=true
VITE_DETECT_DEVTOOLS=false
VITE_PROTECT_RIGHT_CLICK=false
```

### Modo Híbrido (Desarrollo con Seguridad)

```bash
# Útil para probar seguridad mientras desarrollas
VITE_ENABLE_CONSOLE_LOGS=true
VITE_ENCRYPT_LOGS=true  # Logs visibles pero encriptados
VITE_DETECT_DEVTOOLS=true  # Te avisa si abres DevTools
```

---

## 🚨 Troubleshooting

### ❌ Problema: No veo logs en desarrollo

**Solución:**

```bash
# Verifica .env.development
VITE_ENABLE_CONSOLE_LOGS=true  # Debe estar en true

# Reinicia el servidor
npm run dev
```

---

### ❌ Problema: Protecciones activas en desarrollo

**Solución:**

```bash
# Asegúrate de usar .env.development, no .env.production
# Verifica que el archivo se llame exactamente: .env.development

# Reinicia el servidor
npm run dev
```

---

### ❌ Problema: Error "CryptoJS is not defined"

**Solución:**

```bash
# Instala la dependencia
npm install crypto-js

# Reinicia el servidor
npm run dev
```

---

### ❌ Problema: Olvidé la clave de descifrado

**Solución de emergencia:**

```javascript
// En consola del navegador (si logras abrirla):
localStorage.setItem('EMERGENCY_UNLOCK', 'true');
location.reload();
```

O edita el archivo:

```javascript
// src/utils/encryption.js
// Línea 21: Cambia la MASTER_KEY por una nueva
```

---

## ✅ Checklist Pre-Producción

Antes de hacer deploy a Vercel:

```
☐ .env.production creado con todas las protecciones en true
☐ Variables de entorno configuradas en Vercel
☐ Probado npm run build && npm run preview localmente
☐ Verificado que logs no aparecen en preview
☐ Probado combinación de debug (Ctrl+Shift+Alt+D)
☐ Confirmado que localStorage está encriptado
☐ Testeado con usuario estudiante (no debe ver nada)
☐ Actualizado console.log a logger en archivos críticos
```

---

## 🎯 Resumen Ultra-Rápido

```bash
# DESARROLLO (tu día a día):
npm run dev
# → Todo normal, sin cambios

# PRODUCCIÓN (Vercel):
git push
# → Automáticamente protegido

# DEBUG EN PRODUCCIÓN (emergencia):
Ctrl+Shift+Alt+D → Ves logs descifrados
```

---

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Verifica los archivos `.env`
3. Revisa la consola en modo desarrollo
4. Contacta al equipo de desarrollo

---

## 🔑 Claves Importantes

### Clave Maestra de Descifrado

```
NUCLEUS_2024_SECURE_MASTER_KEY_XYZ789_CHANGE_ME
```

**⚠️ IMPORTANTE:** Guarda esta clave en un lugar seguro (1Password, LastPass, etc.)

### Hash del ID de Admin

```javascript
// ID: 1045671402
// Hash SHA-256: (se genera automáticamente)
```

---

## 📚 Archivos del Sistema

```
src/
├── config/
│   └── privacy.config.js       # Configuración central
├── utils/
│   ├── encryption.js           # Utilidades de encriptación
│   ├── secureLogger.js         # Logger seguro
│   └── devToolsProtection.js   # Protección de DevTools
└── main.jsx                    # Inicialización
```

---

## 🚀 Próximos Pasos

1. ✅ Crear archivos `.env.development` y `.env.production`
2. ✅ Reemplazar `console.log` por `logger` en archivos críticos
3. ✅ Probar localmente con `npm run preview`
4. ✅ Configurar variables en Vercel
5. ✅ Hacer deploy

---

**¡Sistema de Privacidad Multinivel listo para usar!** 🎉
