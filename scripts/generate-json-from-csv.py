#!/usr/bin/env python3
"""
==========================================
⚠️ DEPRECATED - DO NOT USE
==========================================

Este script Python está DEPRECADO y ya no es necesario.

RAZÓN: 
Toda la lógica ha sido migrada a JavaScript para simplificar el deployment
y eliminar la necesidad de generar JSONs intermedios.

REEMPLAZO:
src/services/csvProcessor.js - Procesa CSVs directamente en el navegador

VENTAJAS DE LA MIGRACIÓN:
✅ No requiere Python instalado
✅ No requiere pandas
✅ Sin pasos manuales de pre-procesamiento
✅ Deployment más simple
✅ Procesamiento dinámico en tiempo real
✅ Sin archivos JSON intermedios

CÓMO USAR EL NUEVO SISTEMA:
Los CSVs en public/data/ se procesan automáticamente cuando la app carga.
No necesitas ejecutar ningún script.

DOCUMENTACIÓN:
Ver MIGRATION.md para detalles completos de la migración.

Este archivo se mantiene solo por referencia histórica.
Puede ser eliminado de forma segura.

==========================================
"""

# Código original comentado para referencia histórica
# Ver src/services/csvProcessor.js para la implementación actual

"""
import pandas as pd
import json
import os
from pathlib import Path
import re

# ... resto del código original ...
# (Ver commit history para código completo)
"""

if __name__ == '__main__':
    print("⚠️  ADVERTENCIA: Este script está DEPRECADO")
    print("📝 Usa src/services/csvProcessor.js en su lugar")
    print("📖 Ver MIGRATION.md para más información")
    print("❌ Este archivo puede ser eliminado de forma segura")
