/**
 * ========================================
 * NUCLEUS ANALYTICS - Configuración de Privacidad
 * ========================================
 * 
 * Sistema multinivel de protección de privacidad y seguridad.
 * Configuración centralizada que se adapta automáticamente según el entorno.
 * 
 * @author NUCLEUS Team
 * @version 2.0.0
 */

// ========================================
// LECTURA DE VARIABLES DE ENTORNO
// ========================================

const getEnvBoolean = (key, defaultValue = false) => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === true;
};

const getEnvString = (key, defaultValue = '') => {
    return import.meta.env[key] || defaultValue;
};

// ========================================
// DETECCIÓN AUTOMÁTICA DE ENTORNO
// ========================================

const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;
const securityMode = getEnvString('VITE_SECURITY_MODE', isDevelopment ? 'development' : 'production');

// ========================================
// CONFIGURACIÓN DE PRIVACIDAD
// ========================================

export const privacyConfig = {

    // 🌍 Información del entorno
    environment: {
        isProduction,
        isDevelopment,
        mode: securityMode,
    },

    // 📝 Configuración de Logs
    logs: {
        // ¿Mostrar logs en consola?
        enabled: getEnvBoolean('VITE_ENABLE_CONSOLE_LOGS', isDevelopment),

        // ¿Encriptar logs antes de mostrarlos?
        encrypt: getEnvBoolean('VITE_ENCRYPT_LOGS', isProduction),

        // Niveles de log permitidos (en producción solo errors)
        allowedLevels: isProduction ? ['error'] : ['log', 'info', 'warn', 'error', 'debug'],

        // ¿Mostrar stack traces completos?
        showStackTrace: isDevelopment,

        // ¿Incluir timestamp en logs?
        includeTimestamp: true,

        // ¿Incluir información del archivo/línea?
        includeSource: isDevelopment,
    },

    // 🛠️ Configuración de DevTools
    devTools: {
        // ¿Permitir uso de DevTools?
        enabled: getEnvBoolean('VITE_ENABLE_DEVTOOLS', isDevelopment),

        // ¿Detectar cuando se abren DevTools?
        detect: getEnvBoolean('VITE_DETECT_DEVTOOLS', isProduction),

        // ¿Mostrar advertencia al detectar DevTools?
        showWarning: isProduction,

        // ¿Cerrar sesión automáticamente? (desactivado por defecto)
        autoLogout: false,

        // ¿Limpiar datos sensibles al detectar DevTools?
        clearSensitiveData: isProduction,
    },

    // 🖱️ Configuración de Interfaz
    interface: {
        // ¿Proteger click derecho?
        protectRightClick: getEnvBoolean('VITE_PROTECT_RIGHT_CLICK', isProduction),

        // ¿Deshabilitar selección de texto?
        disableTextSelection: getEnvBoolean('VITE_DISABLE_TEXT_SELECTION', false),

        // ¿Deshabilitar atajos de teclado de DevTools?
        disableDevToolsShortcuts: isProduction,

        // ¿Mostrar mensaje personalizado en click derecho?
        showCustomMessage: isProduction,

        // Mensaje a mostrar
        customMessage: '⚠️ Esta función está deshabilitada por seguridad',
    },

    // 💾 Configuración de Almacenamiento
    storage: {
        // ¿Encriptar datos en localStorage?
        encrypt: isProduction,

        // ¿Usar sessionStorage en lugar de localStorage? (más seguro)
        useSessionStorage: false,

        // ¿Limpiar storage al cerrar sesión?
        clearOnLogout: true,

        // ¿Validar integridad de datos?
        validateIntegrity: isProduction,

        // Tiempo de expiración de datos (en ms, 0 = sin expiración)
        expirationTime: 0,
    },

    // 🔐 Configuración de Encriptación
    encryption: {
        // Algoritmo de encriptación
        algorithm: 'AES',

        // ¿Usar salt aleatorio?
        useRandomSalt: true,

        // ¿Rotar claves periódicamente?
        rotateKeys: false,

        // Intervalo de rotación (en ms)
        rotationInterval: 24 * 60 * 60 * 1000, // 24 horas
    },

    // 🎮 Configuración de Debug para Admin
    adminDebug: {
        // Combinación de teclas para activar debug
        keyCombo: getEnvString('VITE_ADMIN_DEBUG_KEY', 'Ctrl+Shift+Alt+D'),

        // ¿Requiere autenticación para activar?
        requireAuth: true,

        // ¿Mostrar modal de confirmación?
        showConfirmation: true,

        // Duración del modo debug (en ms, 0 = permanente hasta reload)
        duration: 0,

        // ¿Permitir descifrado de logs?
        allowDecryption: true,
    },

    // 🔍 Configuración de Monitoreo
    monitoring: {
        // ¿Registrar intentos de acceso no autorizado?
        logAttempts: isProduction,

        // ¿Enviar alertas al admin?
        sendAlerts: false,

        // ¿Guardar logs de seguridad?
        saveSecurityLogs: isProduction,

        // Máximo de intentos antes de bloquear
        maxAttempts: 5,

        // Tiempo de bloqueo (en ms)
        blockDuration: 15 * 60 * 1000, // 15 minutos
    },

    // 🌐 Configuración de Red
    network: {
        // ¿Ofuscar URLs de API?
        obfuscateUrls: isProduction,

        // ¿Encriptar payloads?
        encryptPayloads: false,

        // ¿Validar origen de peticiones?
        validateOrigin: isProduction,

        // ¿Agregar headers de seguridad?
        addSecurityHeaders: isProduction,
    },

    // 🎯 Excepciones y Reglas Especiales
    exceptions: {
        // IDs de admin que pueden bypasear protecciones
        adminIds: ['1045671402'],

        // Dominios permitidos para bypass (desarrollo)
        allowedDomains: ['localhost', '127.0.0.1', 'nucleus-analytics.vercel.app'],

        // Rutas que no requieren protección
        publicRoutes: ['/login', '/'],

        // ¿Permitir bypass con Ctrl+Click?
        allowCtrlBypass: isDevelopment,
    },
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Verifica si el usuario actual es administrador
 */
export const isAdmin = () => {
    try {
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        return userRole === 'admin' || privacyConfig.exceptions.adminIds.includes(userId);
    } catch {
        return false;
    }
};

/**
 * Verifica si una protección específica está activa
 */
export const isProtectionActive = (category, setting) => {
    try {
        return privacyConfig[category]?.[setting] ?? false;
    } catch {
        return false;
    }
};

/**
 * Obtiene la configuración completa de una categoría
 */
export const getProtectionConfig = (category) => {
    return privacyConfig[category] || {};
};

/**
 * Modo debug activo (se controla desde devToolsProtection.js)
 */
let debugModeActive = false;

export const setDebugMode = (active) => {
    debugModeActive = active;
};

export const isDebugMode = () => {
    return debugModeActive || isDevelopment;
};

// ========================================
// EXPORTACIÓN POR DEFECTO
// ========================================

export default privacyConfig;

// ========================================
// INFORMACIÓN DE CONFIGURACIÓN (solo en desarrollo)
// ========================================

if (isDevelopment) {
    console.log('🔐 NUCLEUS Privacy Config Loaded:', {
        environment: securityMode,
        logsEnabled: privacyConfig.logs.enabled,
        logsEncrypted: privacyConfig.logs.encrypt,
        devToolsEnabled: privacyConfig.devTools.enabled,
        devToolsDetection: privacyConfig.devTools.detect,
        rightClickProtected: privacyConfig.interface.protectRightClick,
        storageEncrypted: privacyConfig.storage.encrypt,
    });
}
