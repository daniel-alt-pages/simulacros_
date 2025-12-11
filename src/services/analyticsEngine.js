/**
 * Módulo de Inteligencia Estadística NUCLEUS (Data Science Engine)
 * Calcula métricas avanzadas de rendimiento, consistencia y gamificación.
 */
export class StudentAnalyticsEngine {
    constructor(flattenedQuestions = []) {
        // Array plano de preguntas respondidas { id, status, area, competency, ... }
        this.questions = flattenedQuestions;
        // Solo preguntas con respuestas válidas (ignoramos las no contestadas si las hubiera)
        this.attempts = this.questions.filter(q => q.selected);
    }

    // --- MÓDULO 1: ESTADÍSTICA PURA (Tendencia Central y Dispersión) ---

    /**
     * Obtiene estadísticas globales de los intentos.
     * NO son promedios de exámenes, son promedios de ACIERTO pregunta a pregunta.
     */
    getPerformanceStats() {
        if (this.attempts.length === 0) return { mean: 0, variance: 0, stdDev: 0, total: 0 };

        // Convertimos acierto/fallo a 1/0 para calcular media y varianza binaria
        const values = this.attempts.map(q => q.status === 'correct' ? 100 : 0);
        const n = values.length;

        // Media (Promedio de acierto global)
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        // Varianza y Desviación Estándar (Volatilidad)
        const squareDiffs = values.map(v => Math.pow(v - mean, 2));
        const variance = squareDiffs.reduce((a, b) => a + b, 0) / n;
        const stdDev = Math.sqrt(variance);

        // Margen de Error (95% confianza para proporción p)
        // Formula para proporción: Z * sqrt(p*(1-p)/n)
        // Usamos Z=1.96
        const p = mean / 100; // Proporción 0-1
        const marginErrorPct = 1.96 * Math.sqrt((p * (1 - p)) / n) * 100;

        return {
            mean: Math.round(mean),
            median: this.calculateMedian(values), // Será 0 o 100 en binario, pero útil si agrupamos
            stdDev: stdDev.toFixed(2),
            consistencyScore: Math.max(0, 100 - stdDev), // Métrica gamificada: 100 es robot, 0 es caos
            marginOfError: marginErrorPct.toFixed(1)
        };
    }

    calculateMedian(values) {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    // --- MÓDULO 2: GAMIFICACIÓN DE RACHAS (Flow Analysis) ---

    /**
     * Analiza el flujo de respuestas consecutivas.
     * Detecta "La Zona" (Racha) y los "Streak Breakers".
     */
    getStreakAnalysis() {
        let currentStreak = 0;
        let maxStreak = 0;
        let totalStreaks = 0; // Cuántas veces logró rachas de 3+
        let streaksHistory = [];
        let breakerMap = {}; // { 'Competencia X': 5 veces }

        // Recorremos cronológicamente (asumiendo que el array de entrada ya lo está)
        this.attempts.forEach((q, index) => {
            if (q.status === 'correct') {
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;

                // Contamos como "Racha Lograda" cada vez que supera 3
                if (currentStreak === 3) totalStreaks++;
            } else {
                // Fallo: Racha rota
                if (currentStreak >= 3) {
                    streaksHistory.push({ length: currentStreak, endRef: index });
                }

                // Registrar al culpable (Streak Breaker)
                // Usamos la competencia o el área como identificador del "enemigo"
                const nemesisName = q.competency || q.areaName || 'General';
                if (currentStreak > 1) { // Solo si rompe algo digno de mencionar (>1)
                    breakerMap[nemesisName] = (breakerMap[nemesisName] || 0) + 1;
                }

                currentStreak = 0;
            }
        });

        // Identificar al "Némesis" (El que más rachas rompe)
        const sortedNemesis = Object.entries(breakerMap).sort((a, b) => b[1] - a[1]);
        const topNemesis = sortedNemesis.length > 0 ? sortedNemesis[0] : null;

        return {
            currentStreak,      // Racha activa actual
            maxStreak,          // Récord histórico
            totalStreaks,       // Cantidad de veces que entró en "la zona" (>3)
            nemesis: topNemesis ? { name: topNemesis[0], kills: topNemesis[1] } : null,
            isOnFire: currentStreak >= 3 // Flag para UI (mostrar fuego)
        };
    }

    /**
     * Proyección simple basada en la media ajustada por consistencia
     */
    getProjection() {
        const stats = this.getPerformanceStats();
        // Si eres muy consistente, tu proyección es tu media.
        // Si eres volátil, penalizamos la proyección (conservadora).
        const volatilityPenalty = parseFloat(stats.stdDev) * 0.1;
        const projectedScore = Math.max(0, Math.min(100, stats.mean - volatilityPenalty));

        return {
            score: Math.round(projectedScore),
            range: `±${stats.marginOfError}%`
        };
    }
}
