/**
 * ========================================
 * NUCLEUS ANALYTICS - Utilidades de Encriptación
 * ========================================
 * 
 * Sistema de encriptación para proteger datos sensibles.
 * Usa AES-256 con salt aleatorio para máxima seguridad.
 * 
 * @author NUCLEUS Team
 * @version 2.0.0
 */

import CryptoJS from 'crypto-js';
import privacyConfig from '@/config/privacy.config';

// ========================================
// CLAVES MAESTRAS
// ========================================

// Clave maestra para encriptación (CAMBIAR EN PRODUCCIÓN)
const MASTER_KEY = 'NUCLEUS_2024_SECURE_MASTER_KEY_XYZ789_CHANGE_ME';

// Clave específica para logs
const LOG_KEY = 'NUCLEUS_LOG_ENCRYPTION_KEY_2024';

// Clave específica para storage
const STORAGE_KEY = 'NUCLEUS_STORAGE_ENCRYPTION_KEY_2024';

// ========================================
// FUNCIONES DE ENCRIPTACIÓN BÁSICAS
// ========================================

/**
 * Encripta un texto usando AES-256
 * @param {string} text - Texto a encriptar
 * @param {string} key - Clave de encriptación (opcional)
 * @returns {string} Texto encriptado
 */
export const encrypt = (text, key = MASTER_KEY) => {
    try {
        if (!text) return '';
        const textStr = typeof text === 'object' ? JSON.stringify(text) : String(text);
        return CryptoJS.AES.encrypt(textStr, key).toString();
    } catch (error) {
        console.error('❌ Error al encriptar:', error);
        return text;
    }
};

/**
 * Desencripta un texto encriptado con AES-256
 * @param {string} encryptedText - Texto encriptado
 * @param {string} key - Clave de desencriptación (opcional)
 * @returns {string} Texto desencriptado
 */
export const decrypt = (encryptedText, key = MASTER_KEY) => {
    try {
        if (!encryptedText) return '';
        const bytes = CryptoJS.AES.decrypt(encryptedText, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);

        // Intentar parsear como JSON si es posible
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch (error) {
        console.error('❌ Error al desencriptar:', error);
        return encryptedText;
    }
};

// ========================================
// ENCRIPTACIÓN DE LOGS
// ========================================

/**
 * Encripta un mensaje de log
 * @param {any} message - Mensaje a encriptar
 * @returns {string} Mensaje encriptado con prefijo
 */
export const encryptLog = (message) => {
    if (!privacyConfig.logs.encrypt) return message;

    try {
        const messageStr = typeof message === 'object'
            ? JSON.stringify(message, null, 2)
            : String(message);

        const encrypted = encrypt(messageStr, LOG_KEY);
        return `🔐 ${encrypted}`;
    } catch (error) {
        return message;
    }
};

/**
 * Desencripta un mensaje de log
 * @param {string} encryptedMessage - Mensaje encriptado
 * @returns {any} Mensaje desencriptado
 */
export const decryptLog = (encryptedMessage) => {
    try {
        // Remover el prefijo 🔐 si existe
        const cleaned = String(encryptedMessage).replace(/^🔐\s*/, '');
        return decrypt(cleaned, LOG_KEY);
    } catch (error) {
        return encryptedMessage;
    }
};

// ========================================
// ALMACENAMIENTO SEGURO (localStorage/sessionStorage)
// ========================================

/**
 * Objeto para manejar almacenamiento encriptado
 */
export const secureStorage = {
    /**
     * Guarda un valor encriptado en localStorage
     * @param {string} key - Clave
     * @param {any} value - Valor a guardar
     */
    set: (key, value) => {
        try {
            const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

            if (privacyConfig.storage.encrypt) {
                const encrypted = encrypt(valueStr, STORAGE_KEY);
                localStorage.setItem(key, encrypted);
            } else {
                localStorage.setItem(key, valueStr);
            }
        } catch (error) {
            console.error('❌ Error al guardar en storage:', error);
        }
    },

    /**
     * Obtiene y desencripta un valor de localStorage
     * @param {string} key - Clave
     * @returns {any} Valor desencriptado
     */
    get: (key) => {
        try {
            const value = localStorage.getItem(key);
            if (!value) return null;

            if (privacyConfig.storage.encrypt) {
                return decrypt(value, STORAGE_KEY);
            } else {
                // Intentar parsear como JSON
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
        } catch (error) {
            console.error('❌ Error al leer de storage:', error);
            return null;
        }
    },

    /**
     * Elimina un valor de localStorage
     * @param {string} key - Clave
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('❌ Error al eliminar de storage:', error);
        }
    },

    /**
     * Limpia todo el localStorage
     */
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('❌ Error al limpiar storage:', error);
        }
    },

    /**
     * Verifica si una clave existe
     * @param {string} key - Clave
     * @returns {boolean}
     */
    has: (key) => {
        try {
            return localStorage.getItem(key) !== null;
        } catch {
            return false;
        }
    },
};

// ========================================
// HASH (para contraseñas y validaciones)
// ========================================

/**
 * Genera un hash SHA-256 de un texto
 * @param {string} text - Texto a hashear
 * @returns {string} Hash en formato hexadecimal
 */
export const hash = (text) => {
    try {
        return CryptoJS.SHA256(String(text)).toString();
    } catch (error) {
        console.error('❌ Error al generar hash:', error);
        return text;
    }
};

/**
 * Verifica si un texto coincide con un hash
 * @param {string} text - Texto a verificar
 * @param {string} hashedText - Hash a comparar
 * @returns {boolean}
 */
export const verifyHash = (text, hashedText) => {
    try {
        return hash(text) === hashedText;
    } catch {
        return false;
    }
};

// ========================================
// GENERACIÓN DE TOKENS
// ========================================

/**
 * Genera un token aleatorio seguro
 * @param {number} length - Longitud del token
 * @returns {string} Token generado
 */
export const generateToken = (length = 32) => {
    try {
        const randomWords = CryptoJS.lib.WordArray.random(length);
        return randomWords.toString();
    } catch (error) {
        console.error('❌ Error al generar token:', error);
        return Math.random().toString(36).substring(2);
    }
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = generateToken(8);
    return `${timestamp}-${randomPart}`;
};

// ========================================
// OFUSCACIÓN (para datos menos sensibles)
// ========================================

/**
 * Ofusca un texto usando Base64 (reversible, no seguro)
 * @param {string} text - Texto a ofuscar
 * @returns {string} Texto ofuscado
 */
export const obfuscate = (text) => {
    try {
        const textStr = typeof text === 'object' ? JSON.stringify(text) : String(text);
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(textStr));
    } catch (error) {
        return text;
    }
};

/**
 * Desofusca un texto en Base64
 * @param {string} obfuscatedText - Texto ofuscado
 * @returns {string} Texto original
 */
export const deobfuscate = (obfuscatedText) => {
    try {
        const decoded = CryptoJS.enc.Base64.parse(obfuscatedText).toString(CryptoJS.enc.Utf8);
        try {
            return JSON.parse(decoded);
        } catch {
            return decoded;
        }
    } catch (error) {
        return obfuscatedText;
    }
};

// ========================================
// VALIDACIÓN DE INTEGRIDAD
// ========================================

/**
 * Genera un checksum para validar integridad de datos
 * @param {any} data - Datos a validar
 * @returns {string} Checksum
 */
export const generateChecksum = (data) => {
    try {
        const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
        return CryptoJS.MD5(dataStr).toString();
    } catch (error) {
        return '';
    }
};

/**
 * Verifica la integridad de datos usando checksum
 * @param {any} data - Datos a verificar
 * @param {string} checksum - Checksum esperado
 * @returns {boolean}
 */
export const verifyIntegrity = (data, checksum) => {
    try {
        return generateChecksum(data) === checksum;
    } catch {
        return false;
    }
};

// ========================================
// EXPORTACIÓN POR DEFECTO
// ========================================

export default {
    encrypt,
    decrypt,
    encryptLog,
    decryptLog,
    secureStorage,
    hash,
    verifyHash,
    generateToken,
    generateUniqueId,
    obfuscate,
    deobfuscate,
    generateChecksum,
    verifyIntegrity,
};
