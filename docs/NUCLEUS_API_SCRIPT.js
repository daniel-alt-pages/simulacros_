/**
 * ==========================================
 * 🔗 NUCLEUS API SCRIPT v2.0 - CALIFICACIÓN LIMPIA
 * - Lectura directa de Google Sheets
 * - Score por materia: 0-100 (porcentaje de aciertos)
 * - Score global: 0-500 (promedio × 5)
 * - Si falta una materia: cuenta como 0
 * ==========================================
 */

// ==========================================
// CONFIGURACIÓN - CLAVES DE RESPUESTA OFICIALES
// ==========================================
const API_CONFIG = {
    AREAS: {
        'matematicas': {
            nombreHoja: '1. MATEMÁTICAS',
            columnaPrefix: 'MATEMÁTICAS',
            total: 25,
            correctas: {
                'MATEMÁTICAS [1.]': 'A', 'MATEMÁTICAS [2.]': 'A', 'MATEMÁTICAS [3.]': 'D',
                'MATEMÁTICAS [4.]': 'C', 'MATEMÁTICAS [5.]': 'A', 'MATEMÁTICAS [6.]': 'C',
                'MATEMÁTICAS [7.]': 'B', 'MATEMÁTICAS [8.]': 'D', 'MATEMÁTICAS [9.]': 'B',
                'MATEMÁTICAS [10.]': 'B', 'MATEMÁTICAS [11.]': 'C', 'MATEMÁTICAS [12.]': 'D',
                'MATEMÁTICAS [13.]': 'C', 'MATEMÁTICAS [14.]': 'C', 'MATEMÁTICAS [15.]': 'C',
                'MATEMÁTICAS [16.]': 'C', 'MATEMÁTICAS [17.]': 'A', 'MATEMÁTICAS [18.]': 'A',
                'MATEMÁTICAS [19.]': 'A', 'MATEMÁTICAS [20.]': 'C', 'MATEMÁTICAS [21.]': 'A',
                'MATEMÁTICAS [22.]': 'C', 'MATEMÁTICAS [23.]': 'D', 'MATEMÁTICAS [24.]': 'B',
                'MATEMÁTICAS [25.]': 'C'
            }
        },
        'lectura_critica': {
            nombreHoja: '2. LECTURA CRÍTICA',
            columnaPrefix: 'LECTURA CRÍTICA',
            total: 25,
            correctas: {
                'LECTURA CRÍTICA [1.]': 'D', 'LECTURA CRÍTICA [2.]': 'C', 'LECTURA CRÍTICA [3.]': 'C',
                'LECTURA CRÍTICA [4.]': 'C', 'LECTURA CRÍTICA [5.]': 'A', 'LECTURA CRÍTICA [6.]': 'D',
                'LECTURA CRÍTICA [7.]': 'C', 'LECTURA CRÍTICA [8.]': 'B', 'LECTURA CRÍTICA [9.]': 'B',
                'LECTURA CRÍTICA [10.]': 'D', 'LECTURA CRÍTICA [11.]': 'B', 'LECTURA CRÍTICA [12.]': 'D',
                'LECTURA CRÍTICA [13.]': 'D', 'LECTURA CRÍTICA [14.]': 'B', 'LECTURA CRÍTICA [15.]': 'D',
                'LECTURA CRÍTICA [16.]': 'A', 'LECTURA CRÍTICA [17.]': 'D', 'LECTURA CRÍTICA [18.]': 'D',
                'LECTURA CRÍTICA [19.]': 'B', 'LECTURA CRÍTICA [20.]': 'B', 'LECTURA CRÍTICA [21.]': 'B',
                'LECTURA CRÍTICA [22.]': 'C', 'LECTURA CRÍTICA [23.]': 'C', 'LECTURA CRÍTICA [24.]': 'D',
                'LECTURA CRÍTICA [25.]': 'B'
            }
        },
        'ciencias_naturales': {
            nombreHoja: '3. CIENCIAS NATURALES',
            columnaPrefix: 'Naturales',
            total: 25,
            correctas: {
                'Naturales [1.]': 'C', 'Naturales [2.]': 'D', 'Naturales [3.]': 'B',
                'Naturales [4.]': 'A', 'Naturales [5.]': 'B', 'Naturales [6.]': 'A',
                'Naturales [7.]': 'B', 'Naturales [8.]': 'C', 'Naturales [9.]': 'A',
                'Naturales [10.]': 'C', 'Naturales [11.]': 'C', 'Naturales [12.]': 'C',
                'Naturales [13.]': 'B', 'Naturales [14.]': 'A', 'Naturales [15.]': 'C',
                'Naturales [16.]': 'D', 'Naturales [17.]': 'C', 'Naturales [18.]': 'A',
                'Naturales [19.]': 'C', 'Naturales [20.]': 'C', 'Naturales [21.]': 'B',
                'Naturales [22.]': 'B', 'Naturales [23.]': 'B', 'Naturales [24.]': 'C',
                'Naturales [25.]': 'C'
            }
        },
        'sociales_ciudadanas': {
            nombreHoja: '4. SOCIALES Y CIUDADANAS',
            columnaPrefix: 'Sociales',
            total: 25,
            correctas: {
                'Sociales [1.]': 'C', 'Sociales [2.]': 'A', 'Sociales [3.]': 'B',
                'Sociales [4.]': 'C', 'Sociales [5.]': 'B', 'Sociales [6.]': 'C',
                'Sociales [7.]': 'A', 'Sociales [8.]': 'B', 'Sociales [9.]': 'D',
                'Sociales [10.]': 'D', 'Sociales [11.]': 'C', 'Sociales [12.]': 'C',
                'Sociales [13.]': 'C', 'Sociales [14.]': 'B', 'Sociales [15.]': 'D',
                'Sociales [16.]': 'A', 'Sociales [17.]': 'B', 'Sociales [18.]': 'B',
                'Sociales [19.]': 'B', 'Sociales [20.]': 'A', 'Sociales [21.]': 'B',
                'Sociales [22.]': 'C', 'Sociales [23.]': 'D', 'Sociales [24.]': 'B',
                'Sociales [25.]': 'B'
            }
        },
        'ingles': {
            nombreHoja: '5. INGLÉS',
            columnaPrefix: 'Inglés',
            total: 30,
            correctas: {
                'Inglés [1.]': 'C', 'Inglés [2.]': 'B', 'Inglés [3.]': 'A',
                'Inglés [4.]': 'C', 'Inglés [5.]': 'B', 'Inglés [6.]': 'C',
                'Inglés [7.]': 'A', 'Inglés [8.]': 'B', 'Inglés [9.]': 'C',
                'Inglés [10.]': 'C', 'Inglés [11.]': 'B', 'Inglés [12.]': 'C',
                'Inglés [13.]': 'C', 'Inglés [14.]': 'B', 'Inglés [15.]': 'A',
                'Inglés [16.]': 'D', 'Inglés [17.]': 'D', 'Inglés [18.]': 'C',
                'Inglés [19.]': 'A', 'Inglés [20.]': 'C', 'Inglés [21.]': 'D',
                'Inglés [22.]': 'B', 'Inglés [23.]': 'D', 'Inglés [24.]': 'D',
                'Inglés [25.]': 'A', 'Inglés [26.]': 'B', 'Inglés [27.]': 'C',
                'Inglés [28.]': 'B', 'Inglés [29.]': 'B', 'Inglés [30.]': 'D'
            }
        }
    },

    // Nombres de las 5 áreas que SIEMPRE deben existir
    TODAS_LAS_AREAS: ['matematicas', 'lectura_critica', 'ciencias_naturales', 'sociales_ciudadanas', 'ingles'],

    // Mapeo de nombres internos a display
    AREA_DISPLAY_NAMES: {
        'matematicas': 'matematicas',
        'lectura_critica': 'lectura critica',
        'ciencias_naturales': 'ciencias naturales',
        'sociales_ciudadanas': 'sociales y ciudadanas',
        'ingles': 'ingles'
    }
};

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

function doGet(e) {
    const action = e.parameter.action || 'getData';
    let result;

    try {
        switch (action) {
            case 'getData':
                result = getAllStudentData();
                break;
            case 'getStudent':
                result = getStudentById(e.parameter.id);
                break;
            case 'getAnswerKeys':
                result = getAnswerKeys();
                break;
            default:
                result = { error: 'Acción no reconocida' };
        }
    } catch (error) {
        result = { error: error.toString() };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Obtiene todos los datos de estudiantes
 */
function getAllStudentData() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const allStudents = {};

    // Procesar cada área
    for (const [areaKey, areaConfig] of Object.entries(API_CONFIG.AREAS)) {
        try {
            const sheet = ss.getSheetByName(areaConfig.nombreHoja);
            if (!sheet) {
                console.log(`⚠️ Hoja no encontrada: ${areaConfig.nombreHoja}`);
                continue;
            }

            const data = sheet.getDataRange().getValues();
            const headers = data[0];

            // Encontrar columnas ID y NOMBRE
            const idIndex = headers.indexOf('ID');
            const nombreIndex = headers.indexOf('NOMBRE');

            // Encontrar columnas de preguntas
            const questionIndices = {};
            headers.forEach((header, index) => {
                const headerStr = String(header).trim();
                if (headerStr.match(/\[\d+\.\]$/)) {
                    questionIndices[headerStr] = index;
                }
            });

            console.log(`📊 ${areaKey}: ${Object.keys(questionIndices).length} preguntas encontradas`);

            // Procesar cada fila de estudiante
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const studentId = String(row[idIndex] || '').trim();
                const studentName = String(row[nombreIndex] || '').trim();

                // Validar ID
                if (!studentId || studentId === 'nan' || studentId.length < 5 || /^[A-Z]\.?$/.test(studentId)) {
                    continue;
                }

                // Inicializar estudiante
                if (!allStudents[studentId]) {
                    allStudents[studentId] = {
                        id: studentId,
                        name: studentName,
                        role: 'student',
                        areas: {}
                    };
                }

                // Contar respuestas correctas
                let correctCount = 0;
                let maxStreak = 0;
                let currentStreak = 0;
                const questionDetails = [];

                for (const [questionId, correctAnswer] of Object.entries(areaConfig.correctas)) {
                    const qIndex = questionIndices[questionId];
                    let studentAnswer = '';

                    if (qIndex !== undefined) {
                        studentAnswer = String(row[qIndex] || '').trim().toUpperCase().replace(/\./g, '');
                    }

                    const isCorrect = studentAnswer === correctAnswer;

                    questionDetails.push({
                        id: questionId,
                        label: questionId,
                        value: studentAnswer,
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
                }

                // Score = porcentaje de aciertos (0-100)
                const score = Math.round((correctCount / areaConfig.total) * 100);
                const displayName = API_CONFIG.AREA_DISPLAY_NAMES[areaKey];

                allStudents[studentId].areas[displayName] = {
                    name: displayName,
                    score: score,
                    correct: correctCount,
                    errors: areaConfig.total - correctCount,
                    total_questions: areaConfig.total,
                    maxStreak: maxStreak,
                    question_details: questionDetails
                };
            }
        } catch (error) {
            console.error(`❌ Error en ${areaKey}:`, error);
        }
    }

    // Calcular puntaje global para cada estudiante
    for (const student of Object.values(allStudents)) {
        // Asegurar que todas las áreas existan (poner 0 si falta)
        for (const areaKey of API_CONFIG.TODAS_LAS_AREAS) {
            const displayName = API_CONFIG.AREA_DISPLAY_NAMES[areaKey];
            if (!student.areas[displayName]) {
                student.areas[displayName] = {
                    name: displayName,
                    score: 0,
                    correct: 0,
                    errors: API_CONFIG.AREAS[areaKey].total,
                    total_questions: API_CONFIG.AREAS[areaKey].total,
                    maxStreak: 0,
                    question_details: []
                };
            }
        }

        student.global_score = calculateGlobalScore(student.areas);
    }

    return {
        success: true,
        timestamp: new Date().toISOString(),
        students: Object.values(allStudents),
        total: Object.keys(allStudents).length
    };
}

/**
 * Calcula puntaje global (0-500)
 * Fórmula: promedio simple de las 5 materias × 5
 */
function calculateGlobalScore(areas) {
    let totalScore = 0;
    let areaCount = 0;

    for (const areaKey of API_CONFIG.TODAS_LAS_AREAS) {
        const displayName = API_CONFIG.AREA_DISPLAY_NAMES[areaKey];
        const areaData = areas[displayName];

        if (areaData) {
            totalScore += areaData.score;
            areaCount++;
        }
    }

    if (areaCount === 0) return 0;

    // Promedio de las 5 materias (cada una 0-100), multiplicado por 5 = 0-500
    const average = totalScore / 5; // Siempre dividir entre 5 (las 5 materias)
    return Math.round(average * 5);
}

/**
 * Obtiene un estudiante por ID
 */
function getStudentById(studentId) {
    const allData = getAllStudentData();
    if (!allData.success) return allData;

    const student = allData.students.find(s => s.id === studentId);
    if (!student) {
        return { error: `Estudiante no encontrado: ${studentId}` };
    }

    return { success: true, student: student };
}

/**
 * Retorna las claves de respuestas
 */
function getAnswerKeys() {
    const keys = {};
    for (const [areaKey, areaConfig] of Object.entries(API_CONFIG.AREAS)) {
        keys[areaKey] = areaConfig.correctas;
    }
    return { success: true, keys: keys };
}

/**
 * Función de prueba
 */
function testScript() {
    const result = getAllStudentData();
    console.log('Total estudiantes:', result.total);

    if (result.students.length > 0) {
        const s = result.students[0];
        console.log('Estudiante:', s.name);
        console.log('Global Score:', s.global_score);

        for (const [areaName, areaData] of Object.entries(s.areas)) {
            console.log(`  ${areaName}: ${areaData.score} (${areaData.correct}/${areaData.total_questions})`);
        }
    }
}
