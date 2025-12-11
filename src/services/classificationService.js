
/**
 * NUCLEUS Classification Service
 * Handles score classification and strategic planning logic.
 */

export const classifyGlobalScore = (score) => {
    // 0-500 scale logic adapted to return rich UI object
    const range = score >= 400 ? { key: "Elite", label: "Elite", color: "text-purple-400", bg: "bg-purple-500", border: "border-purple-500", desc: "Desempeño excepcional." } :
        score >= 350 ? { key: "Advanced", label: "Avanzado", color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500", desc: "Muy buen trabajo." } :
            score >= 300 ? { key: "Competent", label: "Competente", color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500", desc: "Buen nivel base." } :
                score >= 250 ? { key: "Developing", label: "En Desarrollo", color: "text-orange-400", bg: "bg-orange-500", border: "border-orange-500", desc: "Necesitas reforzar." } :
                    { key: "Critical", label: "Crítico", color: "text-red-400", bg: "bg-red-500", border: "border-red-500", desc: "Atención urgente." };

    return {
        ...range,
        message: range.desc, // Compatibility alias
        textColor: range.color, // Compatibility alias
        borderColor: range.border, // Compatibility alias
        bgColor: range.bg,
        icon: "🏆", // Simple icon for now
        description: range.desc,
        positionInRange: Math.min(100, Math.max(0, (score % 50) * 2)), // Fake progress in range
        recommendations: ["Estudio diario obligatorio.", "Prioriza fundamentos."] // Generic fallbacks
    };
};

export const getStrategicPlan = (classificationKey) => {
    return {
        focus: "Plan General de Mejora Continua",
        weeklyHours: 15,
        timeAllocation: {
            "Lectura Crítica": 4, "Matemáticas": 5, "Ciencias Naturales": 3, "Sociales": 2, "Inglés": 1
        },
        steps: ["Revisar errores de los últimos simulacros.", "Realizar ejercicios diarios."],
        priorities: [],
        recommendations: ["Estudio constante.", "Simulacros periódicos."]
    };
};

export const identifyWeakCompetencies = (user) => {
    // Mock for UI compatibility
    return [];
};

export const getCompetencyDistribution = (user) => {
    // Mock distribution: { "4": 1, "3": 2, "2": 1, "1": 1 }
    // In real app, calculate from user.competencies
    return { "3": 3, "2": 2 };
};

export const calculateGapAnalysis = (currentScore, targetScore) => {
    const gap = targetScore - currentScore;
    return {
        gap: gap,
        estimatedWeeks: Math.ceil(gap / 5), // Assumes 5 pts growth per week
        estimatedHours: Math.ceil(gap * 2),
        feasibility: gap < 50 ? "Alta" : "Media"
    };
};

export const mapScoreToLevel = (score) => {
    if (score >= 75) return { title: "Avanzado", level: 4 };
    if (score >= 60) return { title: "Satisfactorio", level: 3 };
    if (score >= 40) return { title: "Mínimo", level: 2 };
    return { title: "Insuficiente", level: 1 };
};
