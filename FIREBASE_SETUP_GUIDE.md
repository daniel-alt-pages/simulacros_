# 🚀 Guía de Configuración de Firebase (Base de Datos en la Nube)

Sigue estos pasos sencillos para conectar NUCLEUS a la nube de forma **100% Gratuita**.

## Paso 1: Crear el Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o "Create a project").
3. Ponle un nombre épico, ej: `nucleus-analytics-db`.
4. Desactiva "Google Analytics" por ahora (no lo necesitamos).
5. Dale a **"Crear proyecto"**.

## Paso 2: Registrar tu App Web

1. Cuando el proyecto esté listo, verás íconos en el centro (iOS, Android, Web </>, Unity).
2. Haz clic en el ícono de **Web (</>)**.
3. Ponle un apodo a la app, ej: `NucleusWeb`.
4. Haz clic en **"Registrar app"**.
5. **¡OJO!** Te aparecerá un bloque de código con `const firebaseConfig = { ... }`.
6. **COPIA** el contenido de ese objeto (apiKey, authDomain, etc.).
7. Ve a tu archivo `src/services/firebase.js` y **PEGA** esos valores reemplazando los placeholders que dejé.

## Paso 3: Activar la Base de Datos (Firestore)

1. En el menú izquierdo de Firebase, busca "Compilación" -> **"Firestore Database"**.
2. Haz clic en **"Crear base de datos"**.
3. Elige la ubicación (déjala por defecto, usualmente `nam5` o `us-central`).
4. **IMPORTANTE - Reglas de Seguridad:**
   - Te preguntará si empezar en "Modo Producción" o "Modo Prueba".
   - Elige **"Modo de prueba"** (Test Mode). Esto permitirá que tu app escriba datos sin configurar autenticación compleja por ahora (ideal para prototipos ráidos).
   - *Nota: En 30 días te avisará, para entonces podemos asegurar las reglas.*

## ¡Listo! 🎉

Tu aplicación ahora tiene un "cerebro" en la nube.

- Cuando un estudiante genere su plan, se guardará en Firestore.
- Podrá entrar desde su celular y ver el mismo plan.
