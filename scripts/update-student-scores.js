/**
 * Script para actualizar los datos de estudiantes con las nuevas claves de respuesta
 * Ejecutar con: node scripts/update-student-scores.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Claves de respuesta actualizadas (formato Google Forms)
const ANSWER_KEYS = {
    "matematicas": {
        "P1": "A", "P2": "A", "P3": "D", "P4": "C", "P5": "A",
        "P6": "C", "P7": "B", "P8": "D", "P9": "B", "P10": "B",
        "P11": "C", "P12": "D", "P13": "C", "P14": "C", "P15": "C",
        "P16": "C", "P17": "A", "P18": "A", "P19": "A", "P20": "C",
        "P21": "A", "P22": "C", "P23": "D", "P24": "B", "P25": "C"
    },
    "lectura critica": {
        "P1": "D", "P2": "C", "P3": "C", "P4": "C", "P5": "A",
        "P6": "D", "P7": "C", "P8": "B", "P9": "B", "P10": "D",
        "P11": "B", "P12": "D", "P13": "D", "P14": "B", "P15": "D",
        "P16": "A", "P17": "D", "P18": "D", "P19": "B", "P20": "B",
        "P21": "B", "P22": "C", "P23": "C", "P24": "D", "P25": "B"
    },
    "ciencias naturales": {
        "P1": "C", "P2": "D", "P3": "B", "P4": "A", "P5": "B",
        "P6": "A", "P7": "B", "P8": "C", "P9": "A", "P10": "C",
        "P11": "C", "P12": "C", "P13": "B", "P14": "A", "P15": "C",
        "P16": "D", "P17": "C", "P18": "A", "P19": "C", "P20": "C",
        "P21": "B", "P22": "B", "P23": "B", "P24": "C", "P25": "C"
    },
    "sociales y ciudadanas": {
        "P1": "C", "P2": "A", "P3": "B", "P4": "C", "P5": "B",
        "P6": "C", "P7": "A", "P8": "B", "P9": "D", "P10": "D",
        "P11": "C", "P12": "C", "P13": "C", "P14": "B", "P15": "D",
        "P16": "A", "P17": "B", "P18": "B", "P19": "B", "P20": "A",
        "P21": "B", "P22": "C", "P23": "D", "P24": "B", "P25": "B"
    },
    "ingles": {
        "P1": "C", "P2": "B", "P3": "A", "P4": "C", "P5": "B",
        "P6": "C", "P7": "A", "P8": "B", "P9": "C", "P10": "C",
        "P11": "B", "P12": "C", "P13": "C", "P14": "B", "P15": "A",
        "P16": "D", "P17": "D", "P18": "C", "P19": "A", "P20": "C",
        "P21": "D", "P22": "B", "P23": "D", "P24": "D", "P25": "A",
        "P26": "B", "P27": "C", "P28": "B", "P29": "B", "P30": "D"
    }
};

// Calcular puntaje dinámico (0-100)
function calculateScore(correctCount, totalQuestions) {
    const percentageCorrect = (correctCount / totalQuestions) * 100;

    // Non-linear ICFES-like curve
    let baseScore;
    if (percentageCorrect >= 100) {
        baseScore = 100;
    } else if (percentageCorrect >= 96) {
        baseScore = 80 + ((percentageCorrect - 96) / 4) * 6;
    } else if (percentageCorrect >= 88) {
        baseScore = 70 + ((percentageCorrect - 88) / 8) * 10;
    } else if (percentageCorrect >= 76) {
        baseScore = 55 + ((percentageCorrect - 76) / 12) * 15;
    } else if (percentageCorrect >= 60) {
        baseScore = 35 + ((percentageCorrect - 60) / 16) * 20;
    } else if (percentageCorrect >= 40) {
        baseScore = 15 + ((percentageCorrect - 40) / 20) * 20;
    } else {
        baseScore = (percentageCorrect / 40) * 15;
    }

    return Math.round(baseScore);
}

// Recalcular datos de un estudiante
function recalculateStudent(student) {
    const weights = {
        'matematicas': 3,
        'lectura critica': 3,
        'sociales y ciudadanas': 3,
        'ciencias naturales': 3,
        'ingles': 1
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [areaName, areaData] of Object.entries(student.areas || {})) {
        const areaKeys = ANSWER_KEYS[areaName];
        if (!areaKeys || !areaData.question_details) continue;

        let correctCount = 0;
        let maxStreak = 0;
        let currentStreak = 0;

        // Recalcular cada pregunta con las nuevas claves
        areaData.question_details.forEach((q, i) => {
            const qKey = q.id || `P${i + 1}`;
            const correctAnswer = areaKeys[qKey];
            const studentAnswer = (q.value || '').toUpperCase().trim();

            const isCorrect = studentAnswer === correctAnswer;
            q.isCorrect = isCorrect;
            q.correctAnswer = correctAnswer;

            if (isCorrect) {
                correctCount++;
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        const totalQuestions = areaData.question_details.length;
        const newScore = calculateScore(correctCount, totalQuestions);

        areaData.score = newScore;
        areaData.errors = totalQuestions - correctCount;
        areaData.correct = correctCount;
        areaData.maxStreak = maxStreak;
        areaData.total_questions = totalQuestions;

        // Calcular global score
        const weight = weights[areaName] || 1;
        weightedSum += newScore * weight;
        totalWeight += weight;
    }

    // Actualizar puntaje global
    if (totalWeight > 0) {
        student.global_score = Math.round((weightedSum / totalWeight) * 5);
    }

    return student;
}

// Main
async function main() {
    const jsonPath = join(__dirname, '..', 'public', 'NUCLEUS_WEB_DB.json');

    console.log('📂 Leyendo archivo JSON...');
    const rawData = readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log(`📊 Encontrados ${data.students?.length || 0} estudiantes`);

    // Recalcular cada estudiante
    let updated = 0;
    data.students = data.students.map(student => {
        const recalculated = recalculateStudent(student);
        updated++;
        return recalculated;
    });

    // Actualizar metadata
    data.metadata = {
        ...data.metadata,
        lastUpdated: new Date().toISOString(),
        keysVersion: '2024-12-12',
        note: 'Recalculado con claves actualizadas'
    };

    // Guardar
    writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    console.log(`✅ Actualizados ${updated} estudiantes`);
    console.log('📄 Archivo guardado:', jsonPath);

    // Mostrar muestra
    if (data.students.length > 0) {
        const sample = data.students[0];
        console.log('\n📝 Muestra del primer estudiante:');
        console.log(`   Nombre: ${sample.name}`);
        console.log(`   Global Score: ${sample.global_score}`);
        for (const [areaName, areaData] of Object.entries(sample.areas || {})) {
            console.log(`   ${areaName}: ${areaData.score} (${areaData.correct || 'N/A'}/${areaData.total_questions || 'N/A'} correctas)`);
        }
    }
}

main().catch(console.error);
