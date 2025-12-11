# Guía de Testing - NUCLEUS Analytics Platform

**Servidor:** [http://localhost:5174/](http://localhost:5174/)
**Fecha:** 2025-12-11

---

## ✅ Checklist de Verificación

### 1. Encoding UTF-8 ✓

#### Qué verificar

- [ ] Abrir la aplicación en el navegador
- [ ] Verificar que todos los textos con tildes se vean correctamente
- [ ] Verificar nombres con eñes (ej: "Matemáticas", "Español")
- [ ] Verificar textos de evidencias y recomendaciones
- [ ] Probar en Chrome, Firefox y Edge

#### Ejemplos de texto a verificar

- "Matemáticas"
- "Lectura Crítica"
- "Sociales y Ciudadanas"
- "Ciencias Naturales"
- "Inglés"

---

### 2. Navegación Sin Pantallas Vacías ✓

#### Flujo de Estudiante

1. [ ] **Login → StudentDashboard**

    - Ingresar ID de estudiante válido
    - Verificar que carga el dashboard completo
    - No debe haber pantallas vacías
2. [ ] **Dashboard → Report**

    - Click en "Análisis Completo"
    - Verificar que carga el reporte completo
    - Verificar botón "Volver al Dashboard"
3. [ ] **Sidebar Navigation**

    - Click en "Dashboard" en sidebar
    - Click en "Reporte Completo" en sidebar
    - Ambos deben funcionar correctamente
4. [ ] **Logout**

    - Click en "Cerrar Sesión"
    - Debe volver a login
    - No debe quedar sesión activa

#### Flujo de Admin

1. [ ] **Login → AdminDashboard**

    - Ingresar "admin" como ID
    - Verificar que carga el panel de administración
    - Verificar estadísticas generales
2. [ ] **Admin Features**

    - Verificar "Banco de Preguntas"
    - Verificar estadísticas por área
    - Verificar que NO muestra 0% en todas las preguntas
3. [ ] **Logout Admin**

    - Click en "Cerrar Sesión"
    - Debe volver a login

---

### 3. Validación Defensiva ✓

#### Casos de Error a Probar

1. [ ] **ID Inválido**

    - Ingresar un ID que no existe
    - Debe mostrar: "Documento no encontrado"
    - No debe crashear la aplicación
2. [ ] **Navegación Directa a URL**

    - Intentar acceder directamente a vistas sin login
    - Debe redirigir o mostrar error apropiado
3. [ ] **Permisos de Rol**

    - Como estudiante, no debe poder acceder a vista admin
    - Como admin, no debe poder acceder a vista de estudiante

---

### 4. Consola del Navegador ✓

#### Qué verificar

- [ ] Abrir DevTools (F12)
- [ ] Ir a la pestaña "Console"
- [ ] Verificar logs de validación:
  - `✅ StudentDashboard cargado correctamente para: [Nombre]`
  - `✅ Navegando a: [vista]`
  - `📊 Total questions for analytics: [número]`

#### No debe haber

- [ ] Errores rojos en consola
- [ ] Warnings de datos faltantes
- [ ] Crashes de componentes

---

## 🧪 Casos de Prueba Específicos

### Caso 1: Login Exitoso de Estudiante

```
Input: ID válido de estudiante
Expected: 
- Dashboard carga completamente
- Muestra nombre del estudiante
- Muestra puntaje global
- Muestra todas las áreas
- No hay errores en consola
```

### Caso 2: Login Exitoso de Admin

```
Input: "admin"
Expected:
- AdminDashboard carga
- Muestra estadísticas generales
- Banco de preguntas con datos reales
- No hay 0% en todas las preguntas
```

### Caso 3: Login Fallido

```
Input: ID inexistente (ej: "999999")
Expected:
- Mensaje: "Documento no encontrado"
- No crashea
- Permite intentar de nuevo
```

### Caso 4: Navegación Completa

```
Steps:
1. Login como estudiante
2. Ver Dashboard
3. Click "Análisis Completo"
4. Ver Report completo
5. Click "Volver al Dashboard"
6. Click área específica (modal)
7. Click "Ver Desglose Completo"
8. Logout

Expected: Todas las transiciones funcionan sin pantallas vacías
```

### Caso 5: Datos Faltantes

```
Scenario: Usuario sin áreas válidas
Expected:
- Mensaje: "Sin resultados"
- Botón "Volver al inicio"
- No crashea la aplicación
```

---

## 📊 Métricas de Éxito

### ✅ Criterios de Aceptación

1. **Encoding**

   - ✓ Todos los caracteres especiales se ven correctamente
   - ✓ No hay caracteres raros (�, Ã±, etc.)
2. **Navegación**

   - ✓ No hay pantallas vacías en ninguna ruta
   - ✓ Todos los botones funcionan o están deshabilitados
   - ✓ Logout funciona correctamente
3. **Datos**

   - ✓ StudentDashboard muestra todos los datos
   - ✓ AdminDashboard muestra estadísticas reales
   - ✓ No hay valores incorrectos en 0%
   - ✓ Gráficos renderizan correctamente
4. **Errores**

   - ✓ Cero errores en consola durante uso normal
   - ✓ Mensajes de error claros y útiles
   - ✓ No hay crashes por datos faltantes

---

## 🔍 Debugging

### Si encuentras problemas

1. **Abrir DevTools (F12)**
2. **Ir a Console**
3. **Buscar mensajes de error o warning**
4. **Verificar logs de validación:**

   - `⚠️ Vista inválida:` - Intento de navegar a vista no válida
   - `❌ user.areas no existe` - Datos de usuario incompletos
   - `❌ No hay áreas válidas` - Sin datos de evaluación
5. **Tomar screenshot del error**
6. **Reportar con:**

   - Pasos para reproducir
   - Screenshot del error
   - Logs de consola
   - Vista/componente afectado

---

## 🎯 IDs de Prueba Sugeridos

### Estudiantes (usar IDs del NUCLEUS_WEB_DB.json)

- Verificar archivo `public/NUCLEUS_WEB_DB.json` para IDs válidos
- Ejemplo de estructura: `"id": "1234567890"`

### Admin

- ID: `admin`
- Password: No requerido

---

## 📝 Notas de Testing

### Navegadores Soportados

- ✓ Chrome (recomendado)
- ✓ Firefox
- ✓ Edge
- ⚠️ Safari (puede tener diferencias de rendering)

### Resoluciones a Probar

- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

---

**Estado:** ✅ LISTO PARA TESTING
**Próximo Paso:** Ejecutar checklist completo y reportar resultados
