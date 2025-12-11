# Scripts Directory

## ⚠️ IMPORTANTE: Archivos Deprecados

Los scripts en este directorio están **DEPRECADOS** y ya no son necesarios.

### ❌ Archivos Obsoletos

1. **`generate-json-from-csv.py`**
   - **Estado**: DEPRECADO
   - **Razón**: Migrado a JavaScript
   - **Reemplazo**: `src/services/csvProcessor.js`
   - **Puede eliminarse**: Sí

2. **`fix-encoding.js`**
   - **Estado**: DEPRECADO
   - **Razón**: Intentaba arreglar archivos inexistentes
   - **Reemplazo**: No necesario
   - **Puede eliminarse**: Sí

### ✅ Nueva Arquitectura

El proyecto ahora procesa los CSVs directamente en el navegador usando JavaScript puro.

**Ventajas:**

- Sin dependencias de Python
- Sin pasos manuales
- Deployment simplificado
- Procesamiento en tiempo real

### 📖 Documentación

Para más información sobre la migración, ver:

- `MIGRATION.md` - Detalles completos de la migración
- `README.md` - Guía de uso actualizada
- `DEPLOYMENT.md` - Instrucciones de deployment

### 🗑️ Limpieza Recomendada

Puedes eliminar este directorio completo de forma segura:

```bash
rm -rf scripts/
```

O mantenerlo solo por referencia histórica (los archivos están comentados).

---

**Última actualización**: 2024-12-11  
**Estado**: Directorio deprecado, puede eliminarse
