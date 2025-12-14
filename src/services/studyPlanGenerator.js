import { PERFORMANCE_LEVELS } from './performanceLevels';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Días de la semana para mapear índices
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * GENERADOR DE PLANES DE ESTUDIO NUCLEUS
 * Algoritmo que cruza disponibilidad con necesidades pedagógicas.
 */
export function generatePersonalizedPlan(studentName, scores, availableSlotsMap) {
    console.log("🧠 Iniciando protocolo de generación de plan para:", studentName);

    // 1. Identificar slots disponibles
    // availableSlotsMap es { "0-morning_1": true, ... }
    const slots = Object.keys(availableSlotsMap).map(key => {
        const [dayIdx, blockId] = key.split('-');
        return {
            dayIdx: parseInt(dayIdx),
            dayName: DAYS[parseInt(dayIdx)],
            blockId,
            blockLabel: getBlockLabel(blockId)
        };
    }).sort((a, b) => a.dayIdx - b.dayIdx); // Ordenar por día

    const totalSlots = slots.length;
    if (totalSlots === 0) return { error: "No hay horas disponibles seleccionadas." };

    console.log(`⏱️ Disponibilidad detectada: ${totalSlots} bloques (${totalSlots * 2} horas)`);

    // 2. Priorizar Áreas (Menor puntaje = Mayor prioridad)
    // scores es { matematicas: 45, lectura_critica: 60... }
    const areas = Object.entries(scores).map(([area, score]) => ({
        id: area,
        score: score || 0,
        weight: 0 // Se calculará abajo
    })).sort((a, b) => a.score - b.score); // Ascendente: los peores primero

    // 3. Asignar Peso de Tiempo (Inversamente proporcional al puntaje)
    // Hacemos una suma invertida para distribuir
    const maxScore = 100;
    const inverseSum = areas.reduce((acc, area) => acc + (maxScore - area.score), 0);

    areas.forEach(area => {
        const gap = maxScore - area.score; // Cuánto le falta para ser perfecto
        area.weight = gap / inverseSum; // Porcentaje del tiempo total
        area.assignedSlots = Math.max(1, Math.round(totalSlots * area.weight)); // Al menos 1 slot
    });

    // Ajuste fino para que coincida con totalSlots exacto
    let assignedTotal = areas.reduce((acc, a) => acc + a.assignedSlots, 0);
    // Si sobran slots, dárselos al área más débil
    while (assignedTotal < totalSlots) {
        areas[0].assignedSlots++;
        assignedTotal++;
    }
    // Si faltan slots (por redondeo hacia arriba), quitar al área con más slots asignados
    // Fix: assignedTotal is NOT an index for areas array. We must find a valid area to reduce.
    while (assignedTotal > totalSlots) {
        // Find area with most slots that has more than 1 (safety floor)
        const areaToReduce = areas.reduce((prev, current) => (prev.assignedSlots > current.assignedSlots) ? prev : current, areas[0]);

        if (areaToReduce.assignedSlots > 1) {
            areaToReduce.assignedSlots--;
            assignedTotal--;
        } else {
            // Edge case: All areas have 1 slot but we still have excess?
            // Force remove from last area even if it goes to 0 (unlikely given logic but safe)
            // Or break to prevent infinite loop
            break;
        }
    }

    // 4. Generar Recursos/Temas Específicos por Área
    // Cruzamos con PERFORMANCE_LEVELS
    const studyPlan = [];
    let currentSlotIndex = 0;

    areas.forEach(area => {
        const areaConfig = PERFORMANCE_LEVELS[area.id];
        if (!areaConfig) return;

        // Determinar Nivel para saber qué estudiar
        // Si sacó 40, está en Nivel 1 o 2. Necesita estudiar temas de ese nivel o el siguiente.
        // Simplificación: Estudiar temas de su nivel actual y el siguiente.
        const currentLevel = getLevelFromScore(area.id, area.score);
        const targetLevelIdx = Math.min(4, currentLevel + 1); // Apuntar al siguiente nivel

        // Obtener syllabus del nivel objetivo
        const levelData = areaConfig.levels[currentLevel] || areaConfig.levels[1];
        const syllabusTopics = getFlattedSyllabus(levelData.syllabus || {});

        let topicIndex = 0;

        for (let i = 0; i < area.assignedSlots; i++) {
            if (currentSlotIndex >= slots.length) break;

            const slot = slots[currentSlotIndex];
            const topic = syllabusTopics[topicIndex % syllabusTopics.length]; // Ciclar temas si hay pocos

            studyPlan.push({
                ...slot,
                areaId: area.id,
                areaName: areaConfig.name,
                topic: topic,
                color: areaConfig.color, // CSS class ref
                focusLevel: `Nivel ${currentLevel} ➔ ${targetLevelIdx}`
            });

            currentSlotIndex++;
            topicIndex++;
        }
    });

    // Reordenar cronológicamente
    studyPlan.sort((a, b) => {
        if (a.dayIdx !== b.dayIdx) return a.dayIdx - b.dayIdx;
        return getBlockOrder(a.blockId) - getBlockOrder(b.blockId);
    });

    return {
        student: studentName,
        totalHours: totalSlots * 2,
        schedule: studyPlan,
        availability: availableSlotsMap,
        generatedAt: new Date().toISOString()
    };
}

// --- UTILIDADES ---

function getBlockLabel(blockId) {
    const labels = {
        'morning_1': '6:00 AM - 8:00 AM',
        'morning_2': '8:00 AM - 10:00 AM',
        'morning_3': '10:00 AM - 12:00 PM',
        'afternoon_1': '2:00 PM - 4:00 PM',
        'afternoon_2': '4:00 PM - 6:00 PM',
        'evening_1': '6:00 PM - 8:00 PM',
        'evening_2': '8:00 PM - 10:00 PM',
    };
    return labels[blockId] || blockId;
}

function getBlockOrder(blockId) {
    const order = ['morning_1', 'morning_2', 'morning_3', 'afternoon_1', 'afternoon_2', 'evening_1', 'evening_2'];
    return order.indexOf(blockId);
}

function getLevelFromScore(area, score) {
    // Lógica simplificada, idealmente importar getPerformanceLevel
    if (score < 35) return 1;
    if (score < 55) return 2;
    if (score < 75) return 3;
    return 4;
}

function getFlattedSyllabus(syllabusObj) {
    let topics = [];
    Object.values(syllabusObj).forEach(list => {
        if (Array.isArray(list)) topics = topics.concat(list);
    });
    if (topics.length === 0) return ["Repaso general de conceptos fundamentales", "Resolución de simulacros"];
    return topics;
}

/**
 * EXPORTAR A PDF
 */
export function exportPlanToPDF(planData) {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("NUCLEUS ANALYTICS", 15, 20);

    doc.setFontSize(12);
    doc.setTextColor(99, 102, 241); // Indigo
    doc.text("Plan de Estudio Personalizado", 15, 30);

    // Info Estudiante
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Estudiante: ${planData.student}`, 15, 50);
    doc.text(`Intensidad Semanal: ${planData.totalHours} Horas`, 15, 55);
    doc.text(`Generado el: ${new Date(planData.generatedAt).toLocaleDateString()}`, 15, 60);

    // Tabla
    const tableData = planData.schedule.map(item => [
        item.dayName,
        item.blockLabel,
        item.areaName,
        item.topic
    ]);

    autoTable(doc, {
        startY: 70,
        head: [['Día', 'Horario', 'Área de Enfoque', 'Tema Específico (Syllabus)']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 25 },
            3: { cellWidth: 'auto' }
        },
        didParseCell: function (data) {
            // Colorear filas por área (opcional, avanzado)
        }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Generado por NUCLEUS AI Engine - Prohibida su venta', 105, 290, null, null, 'center');
    }

    doc.save(`NUCLEUS_Plan_${planData.student.replace(/\s+/g, '_')}.pdf`);
}
