/* 
 * ☢️ NUCLEUS GENESIS v7.3 - ACTUALIZADO CON CLAVES GOOGLE FORMS
 * - Logs acumulativos (no se borran)
 * - Conteo exacto de respuestas únicas
 * - Timestamp en cada actualización
 * - NUEVO: Identificadores de Google Forms (ej: "Naturales [1.]")
 * - NUEVO: Claves de respuesta actualizadas 2024-12-12
 */

const CONFIG = {
    AREAS: {
        'MATEMÁTICAS': {
            nombreHoja: '1. MATEMÁTICAS',
            idSource: '1hpX_YEHzOUpXahgsLXuQWosAy0poW_fccXRZdEofFf0',
            columnaPrefix: 'MATEMÁTICAS',
            total: 25,
            // CLAVES ACTUALIZADAS 2024-12-12
            correctas: {
                'MATEMÁTICAS [1.]': 'A',
                'MATEMÁTICAS [2.]': 'A',
                'MATEMÁTICAS [3.]': 'D',
                'MATEMÁTICAS [4.]': 'C',
                'MATEMÁTICAS [5.]': 'A',
                'MATEMÁTICAS [6.]': 'C',
                'MATEMÁTICAS [7.]': 'B',
                'MATEMÁTICAS [8.]': 'D',
                'MATEMÁTICAS [9.]': 'B',
                'MATEMÁTICAS [10.]': 'B',
                'MATEMÁTICAS [11.]': 'C',
                'MATEMÁTICAS [12.]': 'D',
                'MATEMÁTICAS [13.]': 'C',
                'MATEMÁTICAS [14.]': 'C',
                'MATEMÁTICAS [15.]': 'C',
                'MATEMÁTICAS [16.]': 'C',
                'MATEMÁTICAS [17.]': 'A',
                'MATEMÁTICAS [18.]': 'A',
                'MATEMÁTICAS [19.]': 'A',
                'MATEMÁTICAS [20.]': 'C',
                'MATEMÁTICAS [21.]': 'A',
                'MATEMÁTICAS [22.]': 'C',
                'MATEMÁTICAS [23.]': 'D',
                'MATEMÁTICAS [24.]': 'B',
                'MATEMÁTICAS [25.]': 'C'
            }
        },
        'LECTURA CRÍTICA': {
            nombreHoja: '2. LECTURA CRÍTICA',
            idSource: '1309s5fF1ict2oTm05ouP2wqeYoHYPiE11zVXtifQox8',
            columnaPrefix: 'LECTURA CRÍTICA',
            total: 25,
            correctas: {
                'LECTURA CRÍTICA [1.]': 'D',
                'LECTURA CRÍTICA [2.]': 'C',
                'LECTURA CRÍTICA [3.]': 'C',
                'LECTURA CRÍTICA [4.]': 'C',
                'LECTURA CRÍTICA [5.]': 'A',
                'LECTURA CRÍTICA [6.]': 'D',
                'LECTURA CRÍTICA [7.]': 'C',
                'LECTURA CRÍTICA [8.]': 'B',
                'LECTURA CRÍTICA [9.]': 'B',
                'LECTURA CRÍTICA [10.]': 'D',
                'LECTURA CRÍTICA [11.]': 'B',
                'LECTURA CRÍTICA [12.]': 'D',
                'LECTURA CRÍTICA [13.]': 'D',
                'LECTURA CRÍTICA [14.]': 'B',
                'LECTURA CRÍTICA [15.]': 'D',
                'LECTURA CRÍTICA [16.]': 'A',
                'LECTURA CRÍTICA [17.]': 'D',
                'LECTURA CRÍTICA [18.]': 'D',
                'LECTURA CRÍTICA [19.]': 'B',
                'LECTURA CRÍTICA [20.]': 'B',
                'LECTURA CRÍTICA [21.]': 'B',
                'LECTURA CRÍTICA [22.]': 'C',
                'LECTURA CRÍTICA [23.]': 'C',
                'LECTURA CRÍTICA [24.]': 'D',
                'LECTURA CRÍTICA [25.]': 'B'
            }
        },
        'CIENCIAS NATURALES': {
            nombreHoja: '3. CIENCIAS NATURALES',
            idSource: '1-LQkJz4CRFH8ebHIm54Qjz6pyYGGAoXtobmAKX2Owfc',
            columnaPrefix: 'Naturales',
            total: 25,
            correctas: {
                'Naturales [1.]': 'C',
                'Naturales [2.]': 'D',
                'Naturales [3.]': 'B',
                'Naturales [4.]': 'A',
                'Naturales [5.]': 'B',
                'Naturales [6.]': 'A',
                'Naturales [7.]': 'B',
                'Naturales [8.]': 'C',
                'Naturales [9.]': 'A',
                'Naturales [10.]': 'C',
                'Naturales [11.]': 'C',
                'Naturales [12.]': 'C',
                'Naturales [13.]': 'B',
                'Naturales [14.]': 'A',
                'Naturales [15.]': 'C',
                'Naturales [16.]': 'D',
                'Naturales [17.]': 'C',
                'Naturales [18.]': 'A',
                'Naturales [19.]': 'C',
                'Naturales [20.]': 'C',
                'Naturales [21.]': 'B',
                'Naturales [22.]': 'B',
                'Naturales [23.]': 'B',
                'Naturales [24.]': 'C',
                'Naturales [25.]': 'C'
            }
        },
        'SOCIALES Y CIUDADANAS': {
            nombreHoja: '4. SOCIALES Y CIUDADANAS',
            idSource: '1YT-Rvsh7EAx8MA0Jngum8BwSUJfGo4p7b7elR98o-X8',
            columnaPrefix: 'Sociales',
            total: 25,
            correctas: {
                'Sociales [1.]': 'C',
                'Sociales [2.]': 'A',
                'Sociales [3.]': 'B',
                'Sociales [4.]': 'C',
                'Sociales [5.]': 'B',
                'Sociales [6.]': 'C',
                'Sociales [7.]': 'A',
                'Sociales [8.]': 'B',
                'Sociales [9.]': 'D',
                'Sociales [10.]': 'D',
                'Sociales [11.]': 'C',
                'Sociales [12.]': 'C',
                'Sociales [13.]': 'C',
                'Sociales [14.]': 'B',
                'Sociales [15.]': 'D',
                'Sociales [16.]': 'A',
                'Sociales [17.]': 'B',
                'Sociales [18.]': 'B',
                'Sociales [19.]': 'B',
                'Sociales [20.]': 'A',
                'Sociales [21.]': 'B',
                'Sociales [22.]': 'C',
                'Sociales [23.]': 'D',
                'Sociales [24.]': 'B',
                'Sociales [25.]': 'B'
            }
        },
        'INGLÉS': {
            nombreHoja: '5. INGLÉS',
            idSource: '1tQ0UjKSy6unj6Z1X_iZXpInqC4q0vciycxlBOMPM4nk',
            columnaPrefix: 'Inglés',
            total: 30,
            correctas: {
                'Inglés [1.]': 'C',
                'Inglés [2.]': 'B',
                'Inglés [3.]': 'A',
                'Inglés [4.]': 'C',
                'Inglés [5.]': 'B',
                'Inglés [6.]': 'C',
                'Inglés [7.]': 'A',
                'Inglés [8.]': 'B',
                'Inglés [9.]': 'C',
                'Inglés [10.]': 'C',
                'Inglés [11.]': 'B',
                'Inglés [12.]': 'C',
                'Inglés [13.]': 'C',
                'Inglés [14.]': 'B',
                'Inglés [15.]': 'A',
                'Inglés [16.]': 'D',
                'Inglés [17.]': 'D',
                'Inglés [18.]': 'C',
                'Inglés [19.]': 'A',
                'Inglés [20.]': 'C',
                'Inglés [21.]': 'D',
                'Inglés [22.]': 'B',
                'Inglés [23.]': 'D',
                'Inglés [24.]': 'D',
                'Inglés [25.]': 'A',
                'Inglés [26.]': 'B',
                'Inglés [27.]': 'C',
                'Inglés [28.]': 'B',
                'Inglés [29.]': 'B',
                'Inglés [30.]': 'D'
            }
        }
    },

    HOJAS: { LOGS: 'ZZ_LOGS_SISTEMA' }
};

// ═══════════════════════════════════════════════════════════════════
// 🔧 FUNCIONES HELPER PARA CLAVES
// ═══════════════════════════════════════════════════════════════════

/**
 * Obtiene las claves como array ordenado para una área
 */
function getCorrectasArray(config) {
    const entries = Object.entries(config.correctas);
    // Ordenar por número de pregunta
    entries.sort((a, b) => {
        const numA = parseInt(a[0].match(/\[(\d+)\.\]/)?.[1] || '0');
        const numB = parseInt(b[0].match(/\[(\d+)\.\]/)?.[1] || '0');
        return numA - numB;
    });
    return entries.map(([, value]) => value);
}

/**
 * Obtiene la clave correcta por número de pregunta (1-based)
 */
function getCorrectaByNumber(config, num) {
    const key = `${config.columnaPrefix} [${num}.]`;
    return config.correctas[key] || '';
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 FUNCIÓN PRINCIPAL DE SINCRONIZACIÓN
// ═══════════════════════════════════════════════════════════════════

function ejecutarSincronizacion() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logs = [];
    const timestamp = new Date();
    let areasProcesadas = 0;
    let totalEstudiantes = 0;

    logs.push([timestamp, 'SISTEMA', '🔄 Iniciando sincronización v7.3 (Google Forms IDs)...']);

    for (const [key, config] of Object.entries(CONFIG.AREAS)) {
        try {
            const resultado = procesarArea(ss, key, config, logs, timestamp);
            if (resultado) {
                areasProcesadas++;
                totalEstudiantes += resultado.estudiantesUnicos;
                logs.push([timestamp, key, `✅ Procesados ${resultado.estudiantesUnicos} estudiantes únicos (${resultado.respuestasTotales} respuestas totales, ${resultado.duplicadosEliminados} duplicados eliminados)`]);
            }
        } catch (e) {
            logs.push([timestamp, key, `🔴 ERROR: ${e.message}`]);
        }
    }

    logs.push([timestamp, 'SISTEMA', `✅ Sincronización completada: ${areasProcesadas} áreas, ${totalEstudiantes} estudiantes únicos totales`]);

    // Guardar logs ACUMULATIVOS (no borrar los anteriores)
    guardarLogsAcumulativos(ss, logs);

    if (areasProcesadas === 0) {
        SpreadsheetApp.getUi().alert('⚠️ No se procesó ninguna área.\nRevisa ZZ_LOGS_SISTEMA');
    } else {
        ss.toast(`✅ ${areasProcesadas} áreas sincronizadas | ${totalEstudiantes} estudiantes únicos`, 'NUCLEUS', 5);
    }
}

// ═══════════════════════════════════════════════════════════════════
// 📝 GUARDAR LOGS ACUMULATIVOS (NO BORRAR ANTERIORES)
// ═══════════════════════════════════════════════════════════════════

function guardarLogsAcumulativos(ss, nuevosLogs) {
    let sheetLogs = ss.getSheetByName(CONFIG.HOJAS.LOGS);

    if (!sheetLogs) {
        sheetLogs = ss.insertSheet(CONFIG.HOJAS.LOGS);
        sheetLogs.appendRow(['TIMESTAMP', 'ÁREA', 'DETALLE']);
        sheetLogs.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#E8F0FE');
    }

    // Añadir los nuevos logs al final (sin borrar los anteriores)
    if (nuevosLogs.length > 0) {
        const ultimaFila = sheetLogs.getLastRow();
        sheetLogs.getRange(ultimaFila + 1, 1, nuevosLogs.length, 3).setValues(nuevosLogs);
    }

    // Mantener solo los últimos 500 registros para no saturar
    const totalFilas = sheetLogs.getLastRow();
    if (totalFilas > 501) { // 1 header + 500 registros
        sheetLogs.deleteRows(2, totalFilas - 501);
    }

    // Auto-ajustar columnas
    sheetLogs.autoResizeColumns(1, 3);
}

// ═══════════════════════════════════════════════════════════════════
// 🔄 PROCESAMIENTO POR ÁREA
// ═══════════════════════════════════════════════════════════════════

function procesarArea(ss, nombreArea, config, logs, timestamp) {
    const sourceSS = SpreadsheetApp.openById(config.idSource);
    const sheets = sourceSS.getSheets();

    let sourceSheet = null;
    let rawData = [];

    for (const sheet of sheets) {
        const data = sheet.getDataRange().getValues();
        if (data.length > 1) {
            sourceSheet = sheet;
            rawData = data;
            break;
        }
    }

    if (!sourceSheet) {
        logs.push([timestamp, nombreArea, `⚠️ Sin datos en la fuente`]);
        return null;
    }

    const headers = rawData[0].map(h => String(h).trim());

    // Detección de columnas de identidad - ACTUALIZADO para Google Forms
    let idx = { id: -1, nombre: -1, email: -1, time: -1 };
    headers.forEach((h, i) => {
        const H = h.toUpperCase();
        // ID: buscar "Número de Documento" 
        if (H.includes('NÚMERO') && H.includes('DOCUMENTO')) {
            idx.id = i;
        } else if (H.includes('DOCUMENTO') && !H.includes('TIPO') && idx.id === -1) {
            idx.id = i;
        }
        // NOMBRE: buscar "ESCRIBE TÚ NOMBRE" o "NOMBRE COMPLETO"
        if (H.includes('ESCRIBE') && H.includes('NOMBRE')) {
            idx.nombre = i;
        } else if (H.includes('NOMBRE COMPLETO')) {
            idx.nombre = i;
        } else if (H.includes('NOMBRE') && !H.includes('EJEMPLO') && idx.nombre === -1) {
            idx.nombre = i;
        }
        if (H.includes('EMAIL') || H.includes('CORREO')) idx.email = i;
        if (H.includes('MARCA') || H.includes('TIMESTAMP')) idx.time = i;
    });

    // NUEVO: Detección de columnas de preguntas con formato Google Forms
    // Buscar columnas como "Naturales [1.]", "LECTURA CRÍTICA [2.]", "Inglés [3.]"
    const questionIndices = {};
    headers.forEach((header, i) => {
        const match = header.match(/^(.+?)\s*\[(\d+)\.\]$/);
        if (match) {
            questionIndices[header] = i;
        }
    });

    // Fallback: buscar columnas que empiecen con [1.]
    let startPreguntas = -1;
    if (Object.keys(questionIndices).length === 0) {
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].includes('[1.]')) { startPreguntas = i; break; }
        }
        if (startPreguntas === -1) {
            startPreguntas = Math.max(idx.id, idx.nombre, idx.email, idx.time) + 1;
        }
    }

    // Obtener claves como array para compatibilidad
    const correctasArray = getCorrectasArray(config);

    // Procesamiento con conteo preciso
    const estudiantesMap = {};
    let respuestasTotales = 0;
    let duplicadosEliminados = 0;

    for (let i = 1; i < rawData.length; i++) {
        const fila = rawData[i];
        const id = String(fila[idx.id] || '').replace(/[^0-9]/g, "").trim();
        if (id.length < 5) continue;

        respuestasTotales++; // Contar TODAS las respuestas en el archivo

        const filaTimestamp = idx.time !== -1 ? new Date(fila[idx.time]) : new Date(0);

        // Si ya existe y es más antiguo, es un duplicado
        if (estudiantesMap[id]) {
            if (estudiantesMap[id].timestamp >= filaTimestamp) {
                duplicadosEliminados++;
                continue; // Ignorar esta respuesta (es más vieja)
            } else {
                duplicadosEliminados++; // La anterior era duplicado
            }
        }

        // NUEVO: Extraer respuestas usando los IDs de Google Forms
        let respuestasLimp = [];

        if (Object.keys(questionIndices).length > 0) {
            // Usar columnas de Google Forms
            for (let q = 1; q <= config.total; q++) {
                const questionKey = `${config.columnaPrefix} [${q}.]`;
                const colIndex = questionIndices[questionKey];
                let respuesta = '';

                if (colIndex !== undefined) {
                    const rawResp = String(fila[colIndex] || '').toUpperCase().trim();
                    const match = rawResp.match(/^([A-D])/);
                    respuesta = match ? match[1] : '';
                }

                respuestasLimp.push(respuesta);
            }
        } else {
            // Fallback: usar posiciones consecutivas
            const respuestasRaw = fila.slice(startPreguntas, startPreguntas + config.total);
            while (respuestasRaw.length < config.total) respuestasRaw.push('');

            respuestasLimp = respuestasRaw.map(r => {
                const m = String(r).toUpperCase().trim().match(/^([A-D])/);
                return m ? m[1] : '';
            });
        }

        estudiantesMap[id] = {
            timestamp: filaTimestamp,
            id,
            nombre: (fila[idx.nombre] || '').toUpperCase().trim(),
            email: (fila[idx.email] || '').toLowerCase().trim(),
            respuestas: respuestasLimp,
            score: calcularScore(respuestasLimp, correctasArray)
        };
    }

    const estudiantesUnicos = Object.keys(estudiantesMap).length;

    // Escritura con IDs de Google Forms
    let targetSheet = ss.getSheetByName(config.nombreHoja);
    if (!targetSheet) targetSheet = ss.insertSheet(config.nombreHoja);
    else targetSheet.clear();

    // Headers con IDs de Google Forms
    const h1 = ['MARCA TEMPORAL', 'ID', 'NOMBRE', 'EMAIL', 'PUNTUACIÓN'];
    const h2 = ['', '', '', 'CLAVE 👉', `${config.total}`];

    // Columnas de preguntas con formato Google Forms
    for (let i = 1; i <= config.total; i++) {
        h1.push(`${config.columnaPrefix} [${i}.]`);
        h2.push(correctasArray[i - 1]);
    }

    // Columnas de feedback
    for (let i = 1; i <= config.total; i++) {
        h1.push(`FB_${config.columnaPrefix} [${i}.]`);
        h2.push('');
    }

    const dataRows = Object.values(estudiantesMap).sort((a, b) => a.timestamp - b.timestamp).map(est => {
        const feedback = est.respuestas.map((r, i) => r === correctasArray[i] ? '✅' : `${r || '-'} ❌`);
        return [est.timestamp, est.id, est.nombre, est.email, `${est.score}/${config.total}`, ...est.respuestas, ...feedback];
    });

    targetSheet.getRange(1, 1, 1, h1.length).setValues([h1]);
    targetSheet.getRange(2, 1, 1, h2.length).setValues([h2]);
    if (dataRows.length) targetSheet.getRange(3, 1, dataRows.length, dataRows[0].length).setValues(dataRows);

    // Formato
    targetSheet.getRange(1, 1, 2, h1.length).setFontWeight('bold').setBorder(true, true, true, true, true, true);
    targetSheet.getRange(2, 6, 1, config.total).setBackground('#D9EAD3').setFontColor('#274E13');
    targetSheet.setFrozenRows(2);
    targetSheet.setFrozenColumns(5);

    // Trim
    const lr = targetSheet.getLastRow(), lc = targetSheet.getLastColumn();
    const maxR = targetSheet.getMaxRows(), maxC = targetSheet.getMaxColumns();
    if (maxC > lc + 1) targetSheet.deleteColumns(lc + 2, maxC - (lc + 1));
    if (maxR > lr + 5) targetSheet.deleteRows(lr + 6, maxR - (lr + 5));

    return {
        estudiantesUnicos: estudiantesUnicos,
        respuestasTotales: respuestasTotales,
        duplicadosEliminados: duplicadosEliminados
    };
}

function calcularScore(respuestas, correctas) {
    return respuestas.reduce((acc, r, i) => (r === correctas[i] ? acc + 1 : acc), 0);
}

// ═══════════════════════════════════════════════════════════════════
// ⏰ CONFIGURACIÓN DE ACTUALIZACIÓN AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════════

function activarActualizacionAutomatica() {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(t => ScriptApp.deleteTrigger(t));

    ScriptApp.newTrigger('ejecutarSincronizacion')
        .timeBased()
        .everyMinutes(5)
        .create();

    SpreadsheetApp.getUi().alert(
        '✅ Actualización Automática Activada',
        'El sistema se sincronizará automáticamente cada 5 minutos.\n\n' +
        'Los logs se acumularán en ZZ_LOGS_SISTEMA (últimos 500 registros).\n\n' +
        'Para desactivar, usa el menú: NUCLEUS → Desactivar Auto-Actualización',
        SpreadsheetApp.getUi().ButtonSet.OK
    );
}

function desactivarActualizacionAutomatica() {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(t => ScriptApp.deleteTrigger(t));

    SpreadsheetApp.getUi().alert(
        '🛑 Actualización Automática Desactivada',
        'Ya no se sincronizará automáticamente.\n\n' +
        'Puedes sincronizar manualmente desde: NUCLEUS → Sincronizar Ahora',
        SpreadsheetApp.getUi().ButtonSet.OK
    );
}

function verEstadoTriggers() {
    const triggers = ScriptApp.getProjectTriggers();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (triggers.length === 0) {
        ss.toast('No hay triggers activos. Usa "Activar Auto-Actualización"', 'ESTADO', 10);
    } else {
        ss.toast(`${triggers.length} trigger(s) activo(s). Se actualiza cada 5 min.`, 'ESTADO', 10);
    }
}

function limpiarLogs() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetLogs = ss.getSheetByName(CONFIG.HOJAS.LOGS);

    if (sheetLogs) {
        sheetLogs.clear();
        sheetLogs.appendRow(['TIMESTAMP', 'ÁREA', 'DETALLE']);
        sheetLogs.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#E8F0FE');
        ss.toast('Logs limpiados correctamente', 'NUCLEUS', 3);
    }
}

// ═══════════════════════════════════════════════════════════════════
// 📋 MENÚ PERSONALIZADO
// ═══════════════════════════════════════════════════════════════════

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('☢️ NUCLEUS')
        .addItem('▶ Sincronizar Ahora', 'ejecutarSincronizacion')
        .addSeparator()
        .addItem('⏰ Activar Auto-Actualización (5 min)', 'activarActualizacionAutomatica')
        .addItem('🛑 Desactivar Auto-Actualización', 'desactivarActualizacionAutomatica')
        .addItem('📊 Ver Estado de Triggers', 'verEstadoTriggers')
        .addSeparator()
        .addItem('🗑️ Limpiar Logs', 'limpiarLogs')
        .addToUi();
}
