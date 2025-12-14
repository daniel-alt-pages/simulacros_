import { SECURITY_CONFIG } from '../config/securityConfig';

const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
};

// Función de "encriptado" visual simple (Base64)
const encryptLog = (...args) => {
    try {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');

        // Retornamos una cadena sin sentido aparente para el usuario
        return btoa(message).split('').reverse().join('');
    } catch (e) {
        return '*** ENC ***';
    }
};

export const initSecureEnvironment = () => {
    if (!SECURITY_CONFIG.ENABLE_SECURE_MODE) {
        // Modo Desarrollo: No hacer nada, dejar la consola normal
        originalConsole.log("🔧 NUCLEUS: Modo Desarrollo Activo");
        return;
    }

    // 1. Mostrar Banner de Advertencia
    originalConsole.log(`%c${SECURITY_CONFIG.CONSOLE_BANNER}`, 'color: #ff3333; font-weight: bold; background: #222; padding: 10px;');

    // 2. Secuestrar la consola
    const noop = () => { };

    // Opción A: Encriptar Todo (Lo que pediste)
    const secureLog = (...args) => {
        // Solo mostramos logs encriptados si realmente queremos ver actividad,
        // de lo contrario, lo mejor es no mostrar NADA.
        // Aquí mostramos el hash encriptado como pediste.
        originalConsole.log(`[SECURE]: ${encryptLog(...args)}`);
    };

    console.log = secureLog;
    console.warn = secureLog;
    console.error = secureLog;
    console.info = secureLog;
    console.table = noop; // Tablas suelen revelar mucha info estructurada

    // 3. Bloqueo de Click Derecho (Context Menu)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 4. Bloqueo de Teclas F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // 5. Limpieza Agresiva (Opcional)
    if (SECURITY_CONFIG.AGGRESSIVE_CLEANING) {
        setInterval(() => {
            console.clear();
            originalConsole.log(`%c${SECURITY_CONFIG.CONSOLE_BANNER}`, 'color: #ff3333; font-weight: bold; background: #222; padding: 10px;');
        }, 2000);
    }
};


export default {
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    log: (...args) => console.log(...args),
    init: initSecureEnvironment
};
