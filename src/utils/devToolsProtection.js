/**
 * ========================================
 * NUCLEUS ANALYTICS - Protección contra DevTools
 * ========================================
 * 
 * Sistema de detección y protección contra el uso no autorizado
 * de herramientas de desarrollo del navegador.
 * 
 * Características:
 * - Detecta apertura de DevTools
 * - Protege contra click derecho
 * - Deshabilita atajos de teclado
 * - Modo debug para administradores
 * 
 * @author NUCLEUS Team
 * @version 2.0.0
 */

import privacyConfig, { isAdmin, setDebugMode } from '@/config/privacy.config';
import logger from '@/utils/secureLogger';

// ========================================
// ESTADO GLOBAL
// ========================================

let devToolsOpen = false;
let debugModeEnabled = false;
let detectionInterval = null;
let keySequence = [];
let keySequenceTimeout = null;

// ========================================
// DETECCIÓN DE DEVTOOLS
// ========================================

/**
 * Detecta si DevTools están abiertos usando varios métodos
 */
const detectDevTools = () => {
    if (!privacyConfig.devTools.detect) return false;

    // Método 1: Diferencia de tamaño de ventana
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    // Método 2: Detección por console.log
    let devtoolsDetected = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            devtoolsDetected = true;
            return 'devtools-detector';
        }
    });

    // Método 3: Timing de debugger (puede causar lag)
    // const before = performance.now();
    // debugger;
    // const after = performance.now();
    // const timingDetected = (after - before) > 100;

    return widthThreshold || heightThreshold || devtoolsDetected;
};

/**
 * Maneja la detección de DevTools
 */
const handleDevToolsDetection = () => {
    const isOpen = detectDevTools();

    if (isOpen && !devToolsOpen && !debugModeEnabled) {
        devToolsOpen = true;
        onDevToolsOpened();
    } else if (!isOpen && devToolsOpen) {
        devToolsOpen = false;
        onDevToolsClosed();
    }
};

/**
 * Callback cuando se detecta apertura de DevTools
 */
const onDevToolsOpened = () => {
    logger.warn('⚠️ DevTools detectados');

    if (privacyConfig.devTools.showWarning) {
        showDevToolsWarning();
    }

    if (privacyConfig.devTools.clearSensitiveData) {
        clearSensitiveData();
    }

    if (privacyConfig.devTools.autoLogout && !isAdmin()) {
        autoLogout();
    }

    // Registrar intento
    logSecurityEvent('devtools_opened');
};

/**
 * Callback cuando se cierran DevTools
 */
const onDevToolsClosed = () => {
    logger.info('ℹ️ DevTools cerrados');
};

/**
 * Muestra advertencia de DevTools
 */
const showDevToolsWarning = () => {
    // Solo mostrar si no es admin
    if (isAdmin()) return;

    const warning = document.createElement('div');
    warning.id = 'devtools-warning';
    warning.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 16px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      ">
        <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #ef4444; margin: 0 0 16px 0; font-size: 24px;">
          Acceso No Autorizado Detectado
        </h2>
        <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
          Se ha detectado el uso de herramientas de desarrollo del navegador.
          Esta acción ha sido registrada por motivos de seguridad.
        </p>
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
          Si eres administrador, cierra esta ventana y usa la combinación de teclas autorizada.
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 24px;
          padding: 12px 32px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
          Entendido
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(warning);

    // Auto-remover después de 10 segundos
    setTimeout(() => {
        const elem = document.getElementById('devtools-warning');
        if (elem) elem.remove();
    }, 10000);
};

/**
 * Limpia datos sensibles cuando se detectan DevTools
 */
const clearSensitiveData = () => {
    logger.warn('🧹 Limpiando datos sensibles...');

    // No limpiar si es admin
    if (isAdmin()) return;

    // Aquí puedes agregar lógica para limpiar datos específicos
    // Por ejemplo, limpiar variables globales, etc.
    // NO limpiar localStorage completo para no cerrar sesión
};

/**
 * Cierra sesión automáticamente
 */
const autoLogout = () => {
    logger.warn('🚪 Cerrando sesión por seguridad...');

    // Limpiar datos de sesión
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    // Redirigir a login
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
};

// ========================================
// PROTECCIÓN DE CLICK DERECHO
// ========================================

/**
 * Previene el click derecho
 */
const preventRightClick = (e) => {
    // Permitir si es admin y usa Ctrl+Click
    if (isAdmin() && e.ctrlKey) return true;

    // Permitir si está en modo debug
    if (debugModeEnabled) return true;

    e.preventDefault();

    if (privacyConfig.interface.showCustomMessage) {
        showCustomMessage(e.clientX, e.clientY, privacyConfig.interface.customMessage);
    }

    logSecurityEvent('right_click_blocked');
    return false;
};

/**
 * Muestra mensaje personalizado en la posición del cursor
 */
const showCustomMessage = (x, y, message) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'security-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: #1f2937;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: fadeInOut 2s ease-in-out;
  `;

    document.body.appendChild(tooltip);

    setTimeout(() => tooltip.remove(), 2000);
};

// ========================================
// PROTECCIÓN DE ATAJOS DE TECLADO
// ========================================

/**
 * Lista de atajos de teclado a bloquear
 */
const blockedShortcuts = [
    { key: 'F12' },                          // DevTools
    { key: 'I', ctrl: true, shift: true },   // DevTools (Ctrl+Shift+I)
    { key: 'J', ctrl: true, shift: true },   // Console (Ctrl+Shift+J)
    { key: 'C', ctrl: true, shift: true },   // Inspect (Ctrl+Shift+C)
    { key: 'U', ctrl: true },                // View Source (Ctrl+U)
    { key: 'S', ctrl: true },                // Save (Ctrl+S) - opcional
];

/**
 * Previene atajos de teclado bloqueados
 */
const preventKeyboardShortcuts = (e) => {
    // No bloquear si está en modo debug
    if (debugModeEnabled) return true;

    // No bloquear si es admin
    if (isAdmin() && e.ctrlKey && e.shiftKey) return true;

    // Verificar si el atajo está bloqueado
    const isBlocked = blockedShortcuts.some(shortcut => {
        const keyMatch = e.key === shortcut.key || e.code === shortcut.key;
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : true;
        const altMatch = shortcut.alt ? e.altKey : true;

        return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (isBlocked) {
        e.preventDefault();
        logSecurityEvent('keyboard_shortcut_blocked', { key: e.key });
        return false;
    }

    return true;
};

// ========================================
// MODO DEBUG PARA ADMINISTRADORES
// ========================================

/**
 * Parsea la combinación de teclas del config
 */
const parseKeyCombo = (combo) => {
    const parts = combo.split('+').map(p => p.trim());
    return {
        ctrl: parts.includes('Ctrl'),
        shift: parts.includes('Shift'),
        alt: parts.includes('Alt'),
        key: parts[parts.length - 1],
    };
};

/**
 * Detecta la combinación de teclas para activar debug
 */
const detectDebugKeyCombo = (e) => {
    const combo = parseKeyCombo(privacyConfig.adminDebug.keyCombo);

    const ctrlMatch = combo.ctrl ? e.ctrlKey : !e.ctrlKey;
    const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
    const altMatch = combo.alt ? e.altKey : !e.altKey;
    const keyMatch = e.key === combo.key || e.code === `Key${combo.key}`;

    if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        e.preventDefault();
        toggleDebugMode();
    }
};

/**
 * Activa/desactiva el modo debug
 */
const toggleDebugMode = () => {
    debugModeEnabled = !debugModeEnabled;
    setDebugMode(debugModeEnabled);

    if (debugModeEnabled) {
        logger.success('🔓 Modo Debug ACTIVADO');
        showDebugModeNotification(true);
    } else {
        logger.info('🔒 Modo Debug DESACTIVADO');
        showDebugModeNotification(false);
    }
};

/**
 * Muestra notificación de modo debug
 */
const showDebugModeNotification = (enabled) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${enabled ? '#10b981' : '#6b7280'};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 999999;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease-out;
  `;
    notification.textContent = enabled ? '🔓 Modo Debug Activado' : '🔒 Modo Debug Desactivado';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// ========================================
// REGISTRO DE EVENTOS DE SEGURIDAD
// ========================================

const securityEvents = [];

/**
 * Registra un evento de seguridad
 */
const logSecurityEvent = (event, data = {}) => {
    if (!privacyConfig.monitoring.logAttempts) return;

    const eventData = {
        event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...data,
    };

    securityEvents.push(eventData);

    // Limitar tamaño del array
    if (securityEvents.length > 100) {
        securityEvents.shift();
    }

    logger.warn('🔒 Evento de seguridad:', eventData);
};

/**
 * Obtiene todos los eventos de seguridad
 */
export const getSecurityEvents = () => {
    return [...securityEvents];
};

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Inicia la protección
 */
export const initDevToolsProtection = () => {
    logger.info('🛡️ Iniciando protección de DevTools...');

    // Detección de DevTools
    if (privacyConfig.devTools.detect) {
        detectionInterval = setInterval(handleDevToolsDetection, 1000);
    }

    // Protección de click derecho
    if (privacyConfig.interface.protectRightClick) {
        document.addEventListener('contextmenu', preventRightClick);
    }

    // Protección de atajos de teclado
    if (privacyConfig.interface.disableDevToolsShortcuts) {
        document.addEventListener('keydown', preventKeyboardShortcuts);
    }

    // Detección de combinación debug
    document.addEventListener('keydown', detectDebugKeyCombo);

    // Deshabilitar selección de texto (opcional)
    if (privacyConfig.interface.disableTextSelection) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    logger.success('✅ Protección de DevTools activada');
};

/**
 * Detiene la protección
 */
export const stopDevToolsProtection = () => {
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }

    document.removeEventListener('contextmenu', preventRightClick);
    document.removeEventListener('keydown', preventKeyboardShortcuts);
    document.removeEventListener('keydown', detectDebugKeyCombo);

    logger.info('🛡️ Protección de DevTools desactivada');
};

// ========================================
// EXPORTACIONES
// ========================================

export default {
    init: initDevToolsProtection,
    stop: stopDevToolsProtection,
    toggleDebugMode,
    getSecurityEvents,
};

// ========================================
// CSS ANIMATIONS
// ========================================

// Inyectar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
