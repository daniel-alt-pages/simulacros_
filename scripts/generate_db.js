import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'dist', 'data');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'NUCLEUS_WEB_DB.json');

const AREA_NAMES = {
    'matematicas': 'matematicas',
    'lectura_critica': 'lectura critica',
    'ciencias_naturales': 'ciencias naturales',
    'sociales_ciudadanas': 'sociales y ciudadanas',
    'ingles': 'ingles'
};

const FILE_MAPPING = {
    'matematicas': 'MATEMÁTICAS.csv',
    'lectura_critica': 'LECTURA CRÍTICA.csv',
    'ciencias_naturales': 'CIENCIAS NATURALES.csv',
    'sociales_ciudadanas': 'SOCIALES Y CIUDADANAS.csv',
    'ingles': 'INGLÉS.csv'
};

// --- Helper Functions (Copied/Adapted from src/services/csvProcessor.js) ---

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle commas inside quotes if necessary, but simple split for now as per original
        const values = lines[i].split(',');
        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });

        data.push(row);
    }
    return data;
}

function calculateDynamicScore(errors, maxStreak, totalQuestions = 25) {
    const correctAnswers = totalQuestions - errors;
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;

    let baseScore;
    if (percentageCorrect >= 100) baseScore = 100;
    else if (percentageCorrect >= 96) baseScore = 80 + ((percentageCorrect - 96) / 4) * 6;
    else if (percentageCorrect >= 88) baseScore = 70 + ((percentageCorrect - 88) / 8) * 10;
    else if (percentageCorrect >= 76) baseScore = 55 + ((percentageCorrect - 76) / 12) * 15;
    else if (percentageCorrect >= 60) baseScore = 35 + ((percentageCorrect - 60) / 16) * 20;
    else if (percentageCorrect >= 40) baseScore = 15 + ((percentageCorrect - 40) / 20) * 20;
    else baseScore = (percentageCorrect / 40) * 15;

    baseScore = Math.round(baseScore);

    let consistencyBonus = 0;
    if (maxStreak > 5) {
        const potentialBonus = Math.min(3, Math.floor(maxStreak / 5));
        if (baseScore + potentialBonus <= 86) {
            consistencyBonus = potentialBonus;
        }
    }

    let inconsistencyPenalty = 0;
    if (errors > 5 && maxStreak < 3) {
        inconsistencyPenalty = 2;
    }

    let finalScore = baseScore + consistencyBonus - inconsistencyPenalty;
    finalScore = Math.min(100, Math.max(0, finalScore)); // Cap at 100? Original said 86 in one place but 100 in another. Let's use 100.

    return Math.round(finalScore);
}

function getPerformanceLevel(areaKey, score) {
    const levelsConfig = {
        'matematicas': { 35: 1, 50: 2, 70: 3, 101: 4 },
        'lectura critica': { 35: 1, 50: 2, 65: 3, 101: 4 },
        'sociales y ciudadanas': { 40: 1, 55: 2, 70: 3, 101: 4 },
        'ciencias naturales': { 40: 1, 55: 2, 70: 3, 101: 4 },
        'ingles': { 47: 1, 57: 2, 67: 3, 78: 4.5, 101: 5 }
    };

    const config = levelsConfig[areaKey] || { 35: 1, 50: 2, 70: 3, 101: 4 };
    const thresholds = Object.entries(config)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    for (const [threshold, level] of thresholds) {
        if (score <= parseInt(threshold)) {
            return level;
        }
    }
    return 1;
}

function processCSVContent(csvText, areaKey, answerKeys = {}) {
    const data = parseCSV(csvText);
    if (data.length === 0) return {};


    const columns = Object.keys(data[0]);

    // Normalize function for flexible matching
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

    // Create a map of normalized column names to original column names
    const normalizedColumns = {};
    columns.forEach(col => {
        normalizedColumns[normalize(col)] = col;
    });

    // Identify question columns based on answer keys
    let questionCols = [];
    const normalizedAnswerKeys = {}; // Map normalized key -> Original Key in answerKeys

    for (const key of Object.keys(answerKeys)) {
        const normKey = normalize(key);
        if (normalizedColumns[normKey]) {
            const originalCol = normalizedColumns[normKey];
            questionCols.push(originalCol);
            normalizedAnswerKeys[originalCol] = key; // Store mapping to original answer key
        }
    }

    // Sort columns
    questionCols.sort((a, b) => {
        const numA = parseInt(a.match(/\[(\d+)\.?\]/)?.[1] || '0');
        const numB = parseInt(b.match(/\[(\d+)\.?\]/)?.[1] || '0');
        return numA - numB;
    });

    if (questionCols.length === 0) {
        console.warn(`No matching columns found for ${areaKey}`);
        console.log('Available columns (first 5):', columns.slice(0, 5));
        console.log('Expected keys (first 5):', Object.keys(answerKeys).slice(0, 5));
        return {};
    }

    const studentsData = {};

    for (const row of data) {
        let studentId = String(row['ID'] || row['NUMERO DE DOCUMENTO'] || row['Número de Documento'] || '').trim();
        const studentName = String(row['NOMBRE'] || row['NOMBRES'] || row['ESCRIBE TÚ NOMBRE COMPLETO'] || '').trim();

        if (!studentId || !studentName || studentId === 'nan') continue;
        studentId = studentId.replace(/[^a-zA-Z0-9]/g, '');
        if (row['ID']?.includes('@') || !studentId) continue;

        let errors = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        const questionDetails = [];
        const totalQuestions = questionCols.length;

        for (const qCol of questionCols) {
            let rawAnswer = String(row[qCol] || '').trim();
            // Remove trailing dot if present (e.g. "A." -> "A")
            let answer = rawAnswer.toUpperCase().replace(/\.$/, '');

            // Use the original key from answerKeys to get the correct answer
            // Because qCol is the column header from CSV, we need to map it back if needed, 
            // but we already know qCol maps to a key in answerKeys via our search, 
            // wait we need to retrieve the value from answerKeys using the *key* that matched qCol.
            let officialAnswerKey = normalizedAnswerKeys[qCol];
            let officialAnswer = answerKeys[officialAnswerKey];
            let isCorrect = false;

            if (officialAnswer) {
                const cleanKey = String(officialAnswer).toUpperCase().replace(/\.$/, '').trim();
                isCorrect = (answer === cleanKey);
            }

            questionDetails.push({
                id: qCol,
                label: qCol,
                isCorrect: isCorrect,
                value: answer,
                correctAnswer: officialAnswer || null
            });

            if (isCorrect) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        errors = questionDetails.filter(q => !q.isCorrect).length;

        const areaName = AREA_NAMES[areaKey] || areaKey;
        const score = calculateDynamicScore(errors, maxStreak, totalQuestions);
        const level = getPerformanceLevel(areaName, score);

        studentsData[studentId] = {
            id: studentId,
            name: studentName,
            areaData: {
                name: areaName,
                score: score,
                errors: errors,
                maxStreak: maxStreak,
                question_details: questionDetails,
                level: level,
                total_questions: totalQuestions
            }
        };
    }

    return studentsData;
}

function calculateAdminAnalytics(studentsList) {
    const adminAnalytics = {};
    for (const areaKey of Object.values(AREA_NAMES)) {
        const questionStats = {};
        for (const student of studentsList) {
            const areaData = student.areas[areaKey];
            if (!areaData || !areaData.question_details) continue;

            for (const q of areaData.question_details) {
                const qId = q.id;
                if (!questionStats[qId]) {
                    questionStats[qId] = {
                        total_responses: 0,
                        correct_responses: 0,
                        distractors: {}
                    };
                }
                questionStats[qId].total_responses++;
                if (q.isCorrect) questionStats[qId].correct_responses++;

                const answerValue = String(q.value || '').trim().toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(answerValue)) {
                    if (!questionStats[qId].distractors[answerValue]) {
                        questionStats[qId].distractors[answerValue] = 0;
                    }
                    questionStats[qId].distractors[answerValue]++;
                }
            }
        }

        for (const [qId, stats] of Object.entries(questionStats)) {
            if (stats.total_responses > 0) {
                stats.correct_rate = Math.round((stats.correct_responses / stats.total_responses) * 100 * 10) / 10;
            } else {
                stats.correct_rate = 0;
            }
            stats.total_attempts = stats.total_responses;
            for (const option of ['A', 'B', 'C', 'D']) {
                if (!stats.distractors[option]) stats.distractors[option] = 0;
            }
        }
        adminAnalytics[areaKey] = questionStats;
    }
    return adminAnalytics;
}

// --- Main Execution ---

async function main() {
    console.log('🚀 Starting Data Generation...');

    // 1. Read Answer Keys
    const keysPath = path.join(DATA_DIR, 'answer_keys.json');
    if (!fs.existsSync(keysPath)) {
        console.error('❌ Answer keys not found:', keysPath);
        process.exit(1);
    }
    const answerKeysData = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
    console.log('✅ Loaded answer keys');

    // 2. Process Each Area
    const allStudents = {}; // map by ID

    for (const [key, filename] of Object.entries(FILE_MAPPING)) {
        const filePath = path.join(DATA_DIR, filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ File not found: ${filename} (skipping ${key})`);
            continue;
        }

        console.log(`Processing file: ${filename}`);
        const csvContent = fs.readFileSync(filePath, 'utf8');
        const fileKeys = answerKeysData[key] || {};

        const areaResults = processCSVContent(csvContent, key, fileKeys);

        // Merge into allStudents
        for (const [studentId, data] of Object.entries(areaResults)) {
            if (!allStudents[studentId]) {
                allStudents[studentId] = {
                    id: studentId,
                    name: data.name, // Assume consistent name
                    role: 'student',
                    areas: {}
                };
            }
            // Use local mapping from internal key to display name
            const areaName = AREA_NAMES[key];
            allStudents[studentId].areas[areaName] = data.areaData;
        }
    }

    const studentsList = Object.values(allStudents);
    console.log(`✅ Processed ${studentsList.length} unique students.`);

    // 3. Calculate Global Scores (if needed? The app seems to calculate them on the fly or we should precalc)
    // Let's pre-calculate global score following scoringEngine logic roughly

    studentsList.forEach(student => {
        let weightedSum = 0;
        let totalWeight = 0;
        const weights = {
            'matematicas': 3,
            'lectura critica': 3,
            'ciencias naturales': 3,
            'sociales y ciudadanas': 3,
            'ingles': 1
        };

        for (const [area, weight] of Object.entries(weights)) {
            const score = student.areas[area]?.score || 0;
            weightedSum += score * weight;
            totalWeight += weight;
        }
        // Score 0-500
        student.global_score = Math.round((weightedSum / totalWeight) * 5);
    });

    // 4. Admin Analytics
    const adminAnalytics = calculateAdminAnalytics(studentsList);

    // 5. Write Output
    const output = {
        students: studentsList,
        metadata: {
            test_name: 'NUCLEUS Analytics (Local Build)',
            date: new Date().toISOString().split('T')[0],
            total_students: studentsList.length,
            generated_at: new Date().toISOString()
        },
        admin_analytics: adminAnalytics
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    console.log(`🎉 DB Written to: ${OUTPUT_FILE}`);
}

main().catch(err => {
    console.error('Fatal Error:', err);
    process.exit(1);
});
