/**
 * NUCLEUS SCORING ENGINE - V10 (Lógica original restaurada)
 * Curva fija ICFES-like + Bonos por consistencia
 */

// Nombres de áreas compatibles con Google Sheets
const AREA_WEIGHTS = {
    'matematicas': 3,
    'lectura critica': 3,
    'ciencias naturales': 3,
    'sociales y ciudadanas': 3,
    'ingles': 1
};

const QUESTIONS_PER_AREA = {
    'matematicas': 25,
    'lectura critica': 25,
    'ciencias naturales': 25,
    'sociales y ciudadanas': 25,
    'ingles': 30
};

/**
 * Calcula puntaje basado en curva fija y rachas (Lógica "Simulacros_")
 */
function calculateScore(correctCount, totalQuestions, maxStreak) {
    const percentage = (correctCount / totalQuestions) * 100;

    // Curva fija ICFES (No lineal)
    let baseScore;
    if (percentage >= 100) baseScore = 100;
    else if (percentage >= 96) baseScore = 80 + ((percentage - 96) / 4) * 6;
    else if (percentage >= 88) baseScore = 70 + ((percentage - 88) / 8) * 10;
    else if (percentage >= 76) baseScore = 55 + ((percentage - 76) / 12) * 15;
    else if (percentage >= 60) baseScore = 35 + ((percentage - 60) / 16) * 20;
    else if (percentage >= 40) baseScore = 15 + ((percentage - 40) / 20) * 20;
    else baseScore = (percentage / 40) * 15;

    baseScore = Math.round(baseScore);

    // Bono por Consistencia (Restaurado)
    let consistencyBonus = 0;
    if (maxStreak > 5) {
        const potentialBonus = Math.min(3, Math.floor(maxStreak / 5));
        if (baseScore + potentialBonus <= 86) { // Solo si no está en rango muy alto
            consistencyBonus = potentialBonus;
        }
    }

    // Penalización por Inconsistencia
    let errors = totalQuestions - correctCount;
    let inconsistencyPenalty = 0;
    if (errors > 5 && maxStreak < 3) {
        inconsistencyPenalty = 2;
    }

    let finalScore = baseScore + consistencyBonus - inconsistencyPenalty;
    return Math.round(Math.min(100, Math.max(0, finalScore)));
}

function calculateGlobalScore(areaScores) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [area, weight] of Object.entries(AREA_WEIGHTS)) {
        weightedSum += (areaScores[area] || 0) * weight;
        totalWeight += weight;
    }

    // Promedio ponderado * 5 = Escala 0-500
    return Math.round((weightedSum / totalWeight) * 5);
}

function extractRawData(student, areaKey) {
    const areaData = student.areas?.[areaKey];
    if (!areaData) return { correct: 0, maxStreak: 0 };

    let correct = 0;
    if (typeof areaData.correct_count === 'number') correct = areaData.correct_count;
    else if (areaData.question_details?.length) {
        correct = areaData.question_details.filter(q => q.isCorrect).length;
    } else {
        correct = areaData.raw_correct || 0;
    }

    return {
        correct,
        maxStreak: areaData.maxStreak || 0
    };
}

export function applyProfessionalScoring(students) {
    if (!students?.length) return students;

    const areaKeys = Object.keys(AREA_WEIGHTS);

    return students.map(student => {
        const areaScores = {};
        const areaDetails = {};

        areaKeys.forEach(area => {
            const { correct, maxStreak } = extractRawData(student, area);
            const maxQ = QUESTIONS_PER_AREA[area];

            // Usar la fórmula restaurada
            const score = calculateScore(correct, maxQ, maxStreak);

            areaScores[area] = score;
            areaDetails[area] = {
                ...(student.areas?.[area] || {}),
                score: score, // Sobrescribir con el cálculo restaurado
                raw_correct: correct,
                maxStreak: maxStreak,
                total_questions: maxQ,
                percentage: Math.round((correct / maxQ) * 100)
            };
        });

        return {
            ...student,
            global_score: calculateGlobalScore(areaScores),
            mat_score: areaScores['matematicas'],
            lec_score: areaScores['lectura critica'],
            nat_score: areaScores['ciencias naturales'],
            soc_score: areaScores['sociales y ciudadanas'],
            ing_score: areaScores['ingles'],
            areas: areaDetails
        };
    });
}

// Simulacro de analytics simple por si se necesita
export function generateGroupAnalytics(students) {
    return { timestamp: new Date().toISOString() };
}

export default {
    applyProfessionalScoring,
    generateGroupAnalytics,
    AREA_WEIGHTS
};
