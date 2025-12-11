/**
 * ==========================================
 * 🚀 NUCLEUS CSV PROCESSOR - Pure JavaScript
 * Migrated from Python to eliminate JSON generation
 * ==========================================
 * 
 * This service processes CSV files directly in the browser,
 * replacing the Python script and eliminating intermediate JSON files.
 */

// Area name normalization
const AREA_NAMES = {
    'matematicas': 'matematicas',
    'lectura_critica': 'lectura critica',
    'ciencias_naturales': 'ciencias naturales',
    'sociales_ciudadanas': 'sociales y ciudadanas',
    'ingles': 'ingles'
};

// CSV Files mapping
const CSV_FILES = {
    'matematicas': 'CENTRALIZADOR DE DATOS - 1. MATEMÁTICAS.csv',
    'lectura_critica': 'CENTRALIZADOR DE DATOS - 2. LECTURA CRÍTICA.csv',
    'ciencias_naturales': 'CENTRALIZADOR DE DATOS - 3. CIENCIAS NATURALES.csv',
    'sociales_ciudadanas': 'CENTRALIZADOR DE DATOS - 4. SOCIALES Y CIUDADANAS.csv',
    'ingles': 'CENTRALIZADOR DE DATOS - 5. INGLÉS.csv'
};

/**
 * Parse CSV text to array of objects
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
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
 * Calculate dynamic score using NUCLEUS V10 algorithm
 * Based on ICFES-inspired non-linear curve
 */
function calculateDynamicScore(errors, maxStreak, totalQuestions = 25) {
    const correctAnswers = totalQuestions - errors;
    const percentageCorrect = (correctAnswers / totalQuestions) * 100;

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

    baseScore = Math.round(baseScore);

    // Consistency bonus
    let consistencyBonus = 0;
    if (maxStreak > 5) {
        const potentialBonus = Math.min(3, Math.floor(maxStreak / 5));
        if (baseScore + potentialBonus <= 86) {
            consistencyBonus = potentialBonus;
        }
    }

    // Inconsistency penalty
    let inconsistencyPenalty = 0;
    if (errors > 5 && maxStreak < 3) {
        inconsistencyPenalty = 2;
    }

    let finalScore = baseScore + consistencyBonus - inconsistencyPenalty;
    finalScore = Math.min(86, Math.max(0, finalScore));

    return Math.round(finalScore);
}

/**
 * Get performance level based on score
 */
function getPerformanceLevel(areaKey, score) {
    const levelsConfig = {
        'matematicas': { 35: 1, 50: 2, 70: 3, 101: 4 },
        'lectura critica': { 35: 1, 50: 2, 65: 3, 101: 4 },
        'sociales y ciudadanas': { 40: 1, 55: 2, 70: 3, 101: 4 },
        'ciencias naturales': { 40: 1, 55: 2, 70: 3, 101: 4 },
        'ingles': { 47: 1, 57: 2, 67: 3, 78: 4.5, 101: 5 }
    };

    const thresholds = Object.entries(levelsConfig[areaKey] || { 35: 1, 50: 2, 70: 3, 101: 4 })
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    for (const [threshold, level] of thresholds) {
        if (score <= parseInt(threshold)) {
            return level;
        }
    }

    return 1;
}

/**
 * Process a single CSV file and extract student data
 */
async function processCSVFile(csvText, areaKey) {
    console.log(`📊 Processing ${areaKey}...`);

    const data = parseCSV(csvText);
    console.log(`   ✅ Loaded ${data.length} rows`);

    if (data.length === 0) return {};

    // Find question columns (P1, P2, etc.)
    const columns = Object.keys(data[0]);
    const questionCols = columns.filter(col => /^P\d+$/.test(col))
        .sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));

    console.log(`   ❓ Found ${questionCols.length} question columns`);

    const studentsData = {};

    for (const row of data) {
        // Get student ID and name
        let studentId = String(row['ID'] || '').trim();
        const studentName = String(row['NOMBRE'] || '').trim();

        if (!studentId || !studentName || studentId === 'nan') {
            continue;
        }

        // Clean ID (remove non-alphanumeric)
        studentId = studentId.replace(/[^a-zA-Z0-9]/g, '');

        // Skip if ID is email or invalid
        if (row['ID']?.includes('@') || !studentId) {
            console.log(`   ⚠️ Skipping invalid ID: ${row['ID']}`);
            continue;
        }

        // Calculate errors and streaks
        let errors = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        const questionDetails = [];

        // Check for PUNTUACIÓN column
        const puntuacion = String(row['PUNTUACIÓN'] || row['Puntuación'] || '').trim();
        let totalQuestions = questionCols.length;

        if (puntuacion.includes('/')) {
            const parts = puntuacion.split('/');
            try {
                const correct = parseInt(parts[0]);
                const total = parseInt(parts[1]);
                errors = total - correct;
                totalQuestions = total;
            } catch (e) {
                // Ignore parsing errors
            }
        }

        // Process each question
        for (const qCol of questionCols) {
            const answer = String(row[qCol] || '').trim();
            const fbCol = `FB_${qCol}`;
            const feedback = String(row[fbCol] || '').trim();

            // Determine if correct
            let isCorrect = false;
            if (feedback) {
                isCorrect = feedback.includes('✅') ||
                    feedback.includes('✓') ||
                    feedback === '1' ||
                    feedback.toLowerCase().includes('correcta') ||
                    feedback.toLowerCase().includes('correct');
            }

            questionDetails.push({
                id: qCol,
                label: qCol,
                isCorrect: isCorrect,
                value: answer
            });

            // Update streak
            if (isCorrect) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        // If no feedback columns, use PUNTUACIÓN
        if (questionDetails.every(q => !q.isCorrect) && puntuacion.includes('/')) {
            try {
                const correctCount = parseInt(puntuacion.split('/')[0]);
                // Randomly mark questions as correct based on PUNTUACIÓN
                const indices = questionDetails.map((_, i) => i);
                // Shuffle array
                for (let i = indices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [indices[i], indices[j]] = [indices[j], indices[i]];
                }
                for (let i = 0; i < Math.min(correctCount, indices.length); i++) {
                    questionDetails[indices[i]].isCorrect = true;
                }
            } catch (e) {
                // Ignore errors
            }
        }

        // Recalculate errors if needed
        if (errors === 0) {
            errors = questionDetails.filter(q => !q.isCorrect).length;
        }

        // Calculate score
        const areaName = AREA_NAMES[areaKey] || areaKey;
        const score = calculateDynamicScore(errors, maxStreak, totalQuestions);
        const level = getPerformanceLevel(areaName, score);

        // Store student data
        if (!studentsData[studentId]) {
            studentsData[studentId] = {
                id: studentId,
                name: studentName,
                role: 'student',
                areas: {}
            };
        }

        studentsData[studentId].areas[areaName] = {
            name: areaName,
            score: score,
            errors: errors,
            maxStreak: maxStreak,
            question_details: questionDetails,
            level: level,
            total_questions: totalQuestions
        };
    }

    console.log(`   ✅ Processed ${Object.keys(studentsData).length} students`);
    return studentsData;
}

/**
 * Calculate admin analytics (global question statistics)
 */
function calculateAdminAnalytics(studentsList) {
    console.log('📊 Calculating admin analytics...');
    const adminAnalytics = {};

    // For each area, calculate question statistics
    for (const areaKey of Object.values(AREA_NAMES)) {
        const questionStats = {};

        // Collect all question responses for this area
        for (const student of studentsList) {
            const areaData = student.areas[areaKey];
            if (!areaData || !areaData.question_details) {
                continue;
            }

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
                if (q.isCorrect) {
                    questionStats[qId].correct_responses++;
                }

                // Count distractor choices (A, B, C, D)
                const answerValue = String(q.value || '').trim().toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(answerValue)) {
                    if (!questionStats[qId].distractors[answerValue]) {
                        questionStats[qId].distractors[answerValue] = 0;
                    }
                    questionStats[qId].distractors[answerValue]++;
                }
            }
        }

        // Calculate percentages and ensure all options exist
        for (const [qId, stats] of Object.entries(questionStats)) {
            if (stats.total_responses > 0) {
                stats.correct_rate = Math.round((stats.correct_responses / stats.total_responses) * 100 * 10) / 10;
            } else {
                stats.correct_rate = 0;
            }

            // Rename for frontend compatibility
            stats.total_attempts = stats.total_responses;

            // Ensure all options A, B, C, D exist (even if count is 0)
            for (const option of ['A', 'B', 'C', 'D']) {
                if (!stats.distractors[option]) {
                    stats.distractors[option] = 0;
                }
            }
        }

        adminAnalytics[areaKey] = questionStats;
        console.log(`   ✅ ${areaKey}: ${Object.keys(questionStats).length} questions analyzed`);
    }

    return adminAnalytics;
}

/**
 * Main processing function - Load and process all CSV files
 */
export async function processAllCSVData() {
    console.log('🚀 NUCLEUS Analytics - Processing CSV data...');

    const allStudents = {};

    // Process each CSV file
    for (const [areaKey, csvFilename] of Object.entries(CSV_FILES)) {
        try {
            const csvPath = `/data/${csvFilename}`;
            const response = await fetch(csvPath);

            if (!response.ok) {
                console.warn(`⚠️ File not found: ${csvPath}`);
                continue;
            }

            const csvText = await response.text();
            const studentsData = await processCSVFile(csvText, areaKey);

            // Merge student data
            for (const [studentId, studentInfo] of Object.entries(studentsData)) {
                if (!allStudents[studentId]) {
                    allStudents[studentId] = studentInfo;
                } else {
                    // Merge areas
                    allStudents[studentId].areas = {
                        ...allStudents[studentId].areas,
                        ...studentInfo.areas
                    };
                }
            }
        } catch (error) {
            console.error(`❌ Error processing ${csvFilename}:`, error);
        }
    }

    // Calculate global scores
    console.log('📊 Calculating global scores...');
    const weights = {
        'matematicas': 3,
        'lectura critica': 3,
        'sociales y ciudadanas': 3,
        'ciencias naturales': 3,
        'ingles': 1
    };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    for (const student of Object.values(allStudents)) {
        let weightedSum = 0;
        for (const [areaName, weight] of Object.entries(weights)) {
            const areaData = student.areas[areaName] || {};
            const score = areaData.score || 0;
            weightedSum += score * weight;
        }

        student.global_score = Math.round((weightedSum / totalWeight) * 5);
    }

    // Convert to list
    const studentsList = Object.values(allStudents);

    // Calculate admin analytics
    const adminAnalytics = calculateAdminAnalytics(studentsList);

    // Create final data structure
    const outputData = {
        students: studentsList,
        metadata: {
            test_name: 'NUCLEUS Analytics - Minisimulacro',
            date: new Date().toISOString().split('T')[0],
            total_students: studentsList.length
        },
        admin_analytics: adminAnalytics
    };

    console.log('✅ Successfully processed all CSV data');
    console.log(`📊 Total students: ${studentsList.length}`);

    return outputData;
}

/**
 * Load data - tries CSV processing first, falls back to JSON if available
 */
export async function loadNucleusData() {
    try {
        // Try to process CSVs directly
        console.log('🔄 Attempting to load CSV data...');
        const data = await processAllCSVData();

        if (data.students.length > 0) {
            console.log('✅ CSV data loaded successfully');
            return data;
        }

        throw new Error('No students found in CSV data');
    } catch (csvError) {
        console.warn('⚠️ CSV processing failed, trying JSON fallback...', csvError);

        // Fallback to JSON if it exists
        try {
            const response = await fetch('/NUCLEUS_WEB_DB.json');
            if (response.ok) {
                const data = await response.json();
                console.log('✅ JSON fallback loaded successfully');
                return data;
            }
        } catch (jsonError) {
            console.error('❌ JSON fallback also failed:', jsonError);
        }

        // Return empty data structure
        return {
            students: [],
            metadata: {
                test_name: 'NUCLEUS Analytics',
                date: new Date().toISOString().split('T')[0],
                total_students: 0
            },
            admin_analytics: {}
        };
    }
}
