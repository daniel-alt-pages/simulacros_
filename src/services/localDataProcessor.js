/**
 * ==========================================
 * 🚀 NUCLEUS LOCAL DATA PROCESSOR
 * ==========================================
 * 
 * Procesa los 5 CSVs limpios directamente desde /dist/data/
 * Extrae claves de respuesta, calcula puntajes y genera analytics.
 * 
 * @author NUCLEUS Analytics Team
 * @version 2.0.0
 */

import logger from '../utils/secureLogger';

// Configuración de archivos CSV
const CSV_FILES = {
    'matematicas': 'MATEMÁTICAS.csv',
    'lectura_critica': 'LECTURA CRÍTICA.csv',
    'ciencias_naturales': 'CIENCIAS NATURALES.csv',
    'sociales_ciudadanas': 'SOCIALES Y CIUDADANAS.csv',
    'ingles': 'INGLÉS.csv'
};

// Nombres normalizados para el sistema
const AREA_DISPLAY_NAMES = {
    'matematicas': 'matematicas',
    'lectura_critica': 'lectura critica',
    'ciencias_naturales': 'ciencias naturales',
    'sociales_ciudadanas': 'sociales y ciudadanas',
    'ingles': 'ingles'
};

// Preguntas por área
const QUESTIONS_PER_AREA = {
    'matematicas': 25,
    'lectura_critica': 25,
    'ciencias_naturales': 25,
    'sociales_ciudadanas': 25,
    'ingles': 30
};

// Pesos para puntaje global (ICFES style)
const AREA_WEIGHTS = {
    'matematicas': 3,
    'lectura critica': 3,
    'ciencias naturales': 3,
    'sociales y ciudadanas': 3,
    'ingles': 1
};

// Cache para las claves de respuesta cargadas del JSON
let LOADED_ANSWER_KEYS = null;

/**
 * Carga las claves de respuesta desde el archivo JSON fijo
 */
async function loadAnswerKeys() {
    if (LOADED_ANSWER_KEYS) return LOADED_ANSWER_KEYS;

    try {
        const response = await fetch('/data/answer_keys.json');
        if (response.ok) {
            LOADED_ANSWER_KEYS = await response.json();
            logger.log('🔑 Claves de respuesta cargadas desde answer_keys.json');
            return LOADED_ANSWER_KEYS;
        }
    } catch (error) {
        logger.warn('⚠️ No se pudo cargar answer_keys.json:', error);
    }

    return null;
}

/**
 * Parse CSV text con soporte para comas dentro de campos
 */
function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });

        data.push(row);
    }

    return data;
}

/**
 * Detecta columnas de preguntas basándose en el patrón del CSV
 * Soporta: "Naturales [1.]", "MATEMÁTICAS [1.]", "Inglés [1.]", etc.
 */
/**
 * Detecta columnas de preguntas basándose en el patrón del CSV
 * Soporta: "Naturales [1.]", "MATEMÁTICAS [1.]", "Inglés [1.]", etc.
 * FILTRA explícitamente columnas de Feedback (FB_)
 */
function detectQuestionColumns(headers, areaKey) {
    // Patrones por área (Anclados al inicio ^ para evitar coincidencias parciales como FB_Naturales)
    const patterns = {
        'matematicas': /^MATEMÁTICAS?\s*\[(\d+)\.\]/i,
        'lectura_critica': /^LECTURA\s*CR[ÍI]TICA?\s*\[(\d+)\.\]/i,
        'ciencias_naturales': /^Naturales\s*\[(\d+)\.\]/i,
        'sociales_ciudadanas': /^Sociales\s*\[(\d+)\.\]/i,
        'ingles': /^Ingl[ée]s\s*\[(\d+)\.\]/i
    };

    const pattern = patterns[areaKey];
    if (!pattern) return [];

    return headers
        .filter(h => {
            // Ignorar explícitamente columnas de Feedback
            if (h.startsWith('FB_')) return false;
            return pattern.test(h);
        })
        .sort((a, b) => {
            const numA = parseInt(a.match(/\[(\d+)\.\]/)?.[1] || '0');
            const numB = parseInt(b.match(/\[(\d+)\.\]/)?.[1] || '0');
            return numA - numB;
        });
}

/**
 * Extrae las claves de respuesta de la fila especial (segunda fila)
 */
function extractAnswerKeys(data, questionCols) {
    // Buscar fila con "CLAVE" o que tenga ID vacío y respuestas válidas
    const keyRow = data.find(row => {
        const id = String(row['ID'] || '').trim().toLowerCase();
        const puntuacion = String(row['PUNTUACIÓN'] || '').trim();

        // La fila de claves tiene: ID vacío o contiene "clave"
        return !id || id.includes('clave') || puntuacion.includes('👉') || puntuacion === String(questionCols.length);
    });

    const answerKeys = {};
    if (keyRow) {
        questionCols.forEach(col => {
            const value = String(keyRow[col] || '').trim().toUpperCase();
            if (['A', 'B', 'C', 'D'].includes(value)) {
                answerKeys[col] = value;
            }
        });
    }

    return answerKeys;
}

/**
 * Calcula puntaje usando curva ICFES
 */
function calculateDynamicScore(correctCount, maxStreak, totalQuestions) {
    const percentage = (correctCount / totalQuestions) * 100;

    // Curva ICFES no lineal
    let baseScore;
    if (percentage >= 100) baseScore = 100;
    else if (percentage >= 96) baseScore = 80 + ((percentage - 96) / 4) * 6;
    else if (percentage >= 88) baseScore = 70 + ((percentage - 88) / 8) * 10;
    else if (percentage >= 76) baseScore = 55 + ((percentage - 76) / 12) * 15;
    else if (percentage >= 60) baseScore = 35 + ((percentage - 60) / 16) * 20;
    else if (percentage >= 40) baseScore = 15 + ((percentage - 40) / 20) * 20;
    else baseScore = (percentage / 40) * 15;

    baseScore = Math.round(baseScore);

    // Bono por consistencia
    let consistencyBonus = 0;
    if (maxStreak > 5) {
        const potentialBonus = Math.min(3, Math.floor(maxStreak / 5));
        if (baseScore + potentialBonus <= 86) {
            consistencyBonus = potentialBonus;
        }
    }

    // Penalización por inconsistencia
    const errors = totalQuestions - correctCount;
    let inconsistencyPenalty = 0;
    if (errors > 5 && maxStreak < 3) {
        inconsistencyPenalty = 2;
    }

    return Math.round(Math.min(100, Math.max(0, baseScore + consistencyBonus - inconsistencyPenalty)));
}

/**
 * Determina el nivel de desempeño
 */
function getPerformanceLevel(areaKey, score) {
    const thresholds = {
        'matematicas': [35, 50, 70, 100],
        'lectura critica': [35, 50, 65, 100],
        'ciencias naturales': [40, 55, 70, 100],
        'sociales y ciudadanas': [40, 55, 70, 100],
        'ingles': [47, 57, 67, 78, 100]
    };

    const levels = thresholds[areaKey] || [35, 50, 70, 100];
    for (let i = 0; i < levels.length; i++) {
        if (score < levels[i]) return i + 1;
    }
    return levels.length;
}

/**
 * Procesa un archivo CSV individual
 * @param {string} csvText - Contenido del CSV
 * @param {string} areaKey - Clave del área (matematicas, lectura_critica, etc.)
 * @param {Array} officialKeys - Array de claves oficiales desde answer_keys.json
 */
async function processCSVFile(csvText, areaKey, officialKeys = null) {
    logger.log(`📊 Procesando ${areaKey}...`);

    const data = parseCSV(csvText);
    if (data.length === 0) {
        logger.warn(`⚠️ ${areaKey}: CSV vacío`);
        return { students: {}, answerKeys: {}, questionCols: [] };
    }


    const headers = Object.keys(data[0]);
    let questionCols = [];

    // Normalize function for flexible matching
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

    // Create map of normalized headers -> original headers
    const normalizedHeaders = {};
    headers.forEach(h => { normalizedHeaders[normalize(h)] = h; });

    // STRATEGY 1: If we have official keys, match against them (Most Robust)
    if (officialKeys && typeof officialKeys === 'object') {
        Object.keys(officialKeys).forEach(key => {
            const normKey = normalize(key);
            if (normalizedHeaders[normKey]) {
                questionCols.push(normalizedHeaders[normKey]);
            }
        });
    }

    // STRATEGY 2: If no keys or no matches, use Regex (Fallback)
    if (questionCols.length === 0) {
        questionCols = detectQuestionColumns(headers, areaKey);
    }

    // Ensure they are sorted by question number
    questionCols.sort((a, b) => {
        const extractNum = (str) => parseInt(str.match(/\[(\d+)\.?\]/)?.[1] || '0');
        return extractNum(a) - extractNum(b);
    });

    logger.log(`   ❓ ${questionCols.length} columnas de preguntas detectadas`);

    // Usar claves oficiales del JSON si están disponibles
    let answerKeys = {};
    if (officialKeys && typeof officialKeys === 'object') {
        // officialKeys es un objeto { "MATEMÁTICAS [1.]": "A", ... }
        // Usar directamente como answerKeys
        answerKeys = { ...officialKeys };
        logger.log(`   🔑 ${Object.keys(answerKeys).length} claves oficiales cargadas desde JSON`);
    } else {
        // Fallback: extraer del CSV
        answerKeys = extractAnswerKeys(data, questionCols);
        logger.log(`   🔑 ${Object.keys(answerKeys).length} claves extraídas del CSV (fallback)`);
    }

    if (Object.keys(answerKeys).length === 0) {
        logger.warn(`   ⚠️ No se encontraron claves de respuesta en ${areaKey}`);
    }

    const areaName = AREA_DISPLAY_NAMES[areaKey];
    const totalQuestions = questionCols.length || QUESTIONS_PER_AREA[areaKey];
    const studentsData = {};

    // Filtrar solo filas de estudiantes (tienen ID numérico válido)
    const studentRows = data.filter(row => {
        const id = String(row['ID'] || '').trim();
        return id && /^\d+$/.test(id) && id.length >= 5;
    });

    for (const row of studentRows) {
        const studentId = String(row['ID']).trim();
        const studentName = String(row['NOMBRE'] || '').trim();
        const email = String(row['EMAIL'] || '').trim();

        let correctCount = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        const questionDetails = [];

        // Procesar cada pregunta
        questionCols.forEach((col, idx) => {
            const rawAnswer = String(row[col] || '').trim().toUpperCase();
            const correctAnswer = answerKeys[col] || null;
            const isCorrect = correctAnswer ? (rawAnswer === correctAnswer) : false;

            questionDetails.push({
                id: col,
                number: idx + 1,
                label: `Pregunta ${idx + 1}`,
                value: rawAnswer,
                correctAnswer: correctAnswer,
                isCorrect: isCorrect
            });

            if (isCorrect) {
                correctCount++;
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        // Calcular puntaje
        const score = calculateDynamicScore(correctCount, maxStreak, totalQuestions);
        const level = getPerformanceLevel(areaName, score);
        const errors = totalQuestions - correctCount;

        // Almacenar datos del estudiante
        if (!studentsData[studentId]) {
            studentsData[studentId] = {
                id: studentId,
                name: studentName,
                email: email,
                role: 'student',
                areas: {}
            };
        }

        studentsData[studentId].areas[areaName] = {
            name: areaName,
            score: score,
            errors: errors,
            correct_count: correctCount,
            maxStreak: maxStreak,
            question_details: questionDetails,
            level: level,
            total_questions: totalQuestions,
            percentage: Math.round((correctCount / totalQuestions) * 100)
        };
    }

    logger.log(`   ✅ ${Object.keys(studentsData).length} estudiantes procesados`);
    return { students: studentsData, answerKeys, questionCols };
}

/**
 * Calcula el puntaje global ponderado
 * Si el área no existe, se asume 0 (Regla del usuario para consistencia)
 */
function calculateGlobalScore(areaScores) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [area, weight] of Object.entries(AREA_WEIGHTS)) {
        // Se toma 0 si no existe el score
        const score = areaScores[area] !== undefined ? areaScores[area] : 0;
        weightedSum += score * weight;
        totalWeight += weight;
    }

    if (totalWeight === 0) return 0;
    return Math.round((weightedSum / totalWeight) * 5); // Escala 0-500
}

/**
 * Genera analytics globales para el panel de admin
 */
function generateAdminAnalytics(studentsList) {
    logger.log('📊 Generando analytics de administrador...');
    const adminAnalytics = {};

    for (const areaKey of Object.values(AREA_DISPLAY_NAMES)) {
        const questionStats = {};

        // Recolectar estadísticas de todas las respuestas
        for (const student of studentsList) {
            const areaData = student.areas?.[areaKey];
            if (!areaData?.question_details) continue;

            for (const q of areaData.question_details) {
                if (!questionStats[q.id]) {
                    questionStats[q.id] = {
                        id: q.id,
                        number: q.number,
                        correctAnswer: q.correctAnswer,
                        total_responses: 0,
                        correct_responses: 0,
                        distractors: { A: 0, B: 0, C: 0, D: 0 }
                    };
                }

                questionStats[q.id].total_responses++;
                if (q.isCorrect) {
                    questionStats[q.id].correct_responses++;
                }

                const answer = q.value;
                if (['A', 'B', 'C', 'D'].includes(answer)) {
                    questionStats[q.id].distractors[answer]++;
                }
            }
        }

        // Calcular porcentajes y clasificar dificultad
        for (const stats of Object.values(questionStats)) {
            if (stats.total_responses > 0) {
                stats.correct_rate = Math.round((stats.correct_responses / stats.total_responses) * 100 * 10) / 10;
                stats.total_attempts = stats.total_responses;

                // Clasificar dificultad
                if (stats.correct_rate >= 70) stats.difficulty = 'Fácil';
                else if (stats.correct_rate >= 40) stats.difficulty = 'Medio';
                else stats.difficulty = 'Difícil';
            }
        }

        adminAnalytics[areaKey] = questionStats;
        logger.log(`   ✅ ${areaKey}: ${Object.keys(questionStats).length} preguntas analizadas`);
    }

    return adminAnalytics;
}

/**
 * 🚀 FUNCIÓN PRINCIPAL - Carga y procesa todos los CSVs
 */
export async function loadLocalCSVData() {
    logger.log('🚀 NUCLEUS Local Data Processor iniciando...');
    logger.log('📂 Cargando CSVs desde /data/...');

    // Cargar claves de respuesta oficiales
    const officialAnswerKeys = await loadAnswerKeys();

    const allStudents = {};
    const allAnswerKeys = {};
    // Maps for robust merging (Fuzzy Matching)
    const emailToId = {};
    const nameToId = {};
    const loadedAreas = [];

    // Helper: Normalize string for fuzzy matching (lowercase, no accents, no special chars)
    const normalizeKey = (str) => {
        if (!str) return "";
        return String(str)
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ""); // Keep only alphanumeric
    };

    for (const [areaKey, filename] of Object.entries(CSV_FILES)) {
        try {
            const response = await fetch(`/data/${filename}`);
            if (!response.ok) continue;

            const csvText = await response.text();
            const areaOfficialKeys = officialAnswerKeys?.[areaKey]?.column_keys || null;
            const { students, answerKeys } = await processCSVFile(csvText, areaKey, areaOfficialKeys);

            // --- INTELLIGENT MERGING SYSTEM (ID -> Email -> Name) ---
            for (const [id, studentData] of Object.entries(students)) {
                // Prepare keys
                const rawEmail = studentData.email || '';
                const rawName = studentData.name || '';

                const normEmail = normalizeKey(rawEmail);
                const normName = normalizeKey(rawName);

                let targetId = id; // Default: trust the current ID
                let matchMethod = 'ID';

                // CHECK 1: ID Match (Implicit)
                if (allStudents[id]) {
                    targetId = id;
                }
                // CHECK 2: Email Match
                else if (normEmail && emailToId[normEmail]) {
                    targetId = emailToId[normEmail];
                    matchMethod = 'Email';
                }
                // CHECK 3: Name Match (Fallback)
                else if (normName && nameToId[normName]) {
                    targetId = nameToId[normName];
                    matchMethod = 'Nombre';
                }

                // LOG MERGE ACTION (Only if merging different IDs)
                if (targetId !== id) {
                    logger.log(`   🔗 Fusión Inteligente (${matchMethod}): ${id} -> ${targetId}`);
                }

                // EXECUTE MERGE OR CREATE
                if (!allStudents[targetId]) {
                    // --- NEW STUDENT ---
                    allStudents[targetId] = { ...studentData };

                    // Register Keys
                    if (normEmail) emailToId[normEmail] = targetId;
                    if (normName) nameToId[normName] = targetId;
                } else {
                    // --- MERGE EXISTING ---
                    const target = allStudents[targetId];

                    // logger.log(`      Merging ${areaKey} for ${target.name}`); // Debug

                    // Merge Areas
                    Object.assign(target.areas, studentData.areas);

                    // Enrich Profile (Fill missing info)
                    if (!target.name && rawName) target.name = rawName;
                    if (!target.email && rawEmail) target.email = rawEmail;

                    // Update Maps (if this alias wasn't registered yet)
                    if (normEmail && !emailToId[normEmail]) emailToId[normEmail] = targetId;
                    if (normName && !nameToId[normName]) nameToId[normName] = targetId;
                }
            }

            allAnswerKeys[areaKey] = answerKeys;
            loadedAreas.push(areaKey);

        } catch (error) {
            logger.error(`❌ Error procesando ${filename}:`, error);
        }
    }

    // --- FILL MISSING AREAS (ZERO POLICY) ---
    // Ensure every student has all 5 areas present. If missing, fill with 0/Absent.
    const ALL_AREAS = Object.values(AREA_DISPLAY_NAMES);
    for (const student of Object.values(allStudents)) {
        if (!student.areas) student.areas = {};

        ALL_AREAS.forEach(areaName => {
            if (!student.areas[areaName]) {
                student.areas[areaName] = {
                    name: areaName,
                    score: 0,
                    errors: 0,
                    correct_count: 0,
                    maxStreak: 0,
                    question_details: [],
                    level: 0, // 0 indicates "No Presentó"
                    total_questions: 0,
                    percentage: 0,
                    absent: true // Flag for UI
                };
            }
        });
    }

    // Convertir a array y calcular puntajes globales
    const studentsList = Object.values(allStudents).map(student => {
        const areaScores = {};
        for (const [areaName, areaData] of Object.entries(student.areas || {})) {
            areaScores[areaName] = areaData.score || 0;
        }

        return {
            ...student,
            global_score: calculateGlobalScore(areaScores),
            mat_score: areaScores['matematicas'] || 0,
            lec_score: areaScores['lectura critica'] || 0,
            nat_score: areaScores['ciencias naturales'] || 0,
            soc_score: areaScores['sociales y ciudadanas'] || 0,
            ing_score: areaScores['ingles'] || 0
        };
    });

    // Ordenar por puntaje global
    studentsList.sort((a, b) => b.global_score - a.global_score);

    // Generar analytics
    const adminAnalytics = generateAdminAnalytics(studentsList);

    logger.log('✅ Procesamiento completado!');
    logger.log(`   📊 ${studentsList.length} estudiantes consolidados`);
    logger.log(`   📚 ${loadedAreas.length} áreas cargadas: ${loadedAreas.join(', ')}`);

    return {
        students: studentsList,
        metadata: {
            test_name: 'NUCLEUS Analytics - Mini Simulacro',
            date: new Date().toISOString().split('T')[0],
            total_students: studentsList.length,
            areas_loaded: loadedAreas,
            processed_at: new Date().toISOString()
        },
        admin_analytics: adminAnalytics,
        answer_keys: allAnswerKeys
    };
}


/**
 * Exporta los datos procesados como JSON para backup
 */
export function exportToJSON(data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `NUCLEUS_WEB_DB_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

export default {
    loadLocalCSVData,
    exportToJSON,
    CSV_FILES,
    AREA_DISPLAY_NAMES
};
