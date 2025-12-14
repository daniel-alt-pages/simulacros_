export const SECURITY_CONFIG = {
    // Cambia esto a true antes de subir a producción
    ENABLE_SECURE_MODE: true,

    // Mensaje que verán los curiosos si abren la consola
    CONSOLE_BANNER: `
    ╔════════════════════════════════════════════════════╗
    ║                 NUCLEUS ANALYTICS                  ║
    ║        ⚠️  ACCESO RESTRINGIDO AL SISTEMA ⚠️        ║
    ║                                                    ║
    ║   Esta consola está monitoreada y encriptada.      ║
    ║   Cualquier intento de ingeniería inversa será     ║
    ║   registrado.                                      ║
    ╚════════════════════════════════════════════════════╝
    `,

    // Si es true, intentos de abrir DevTools limpiarán la consola
    AGGRESSIVE_CLEANING: true
};
