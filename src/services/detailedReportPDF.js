/**
 * ==========================================
 * 📄 NUCLEUS Professional PDF Generator V2
 * Generador de PDF Ultra Profesional
 * ==========================================
 * 
 * Versión mejorada con:
 * - Diseño fiel a la plataforma web
 * - Mejor distribución de espacios
 * - Gráficos visuales de barras
 * - Análisis detallado de errores
 * - Formato profesional tamaño carta
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { classifyGlobalScore, getStrategicPlan } from './classificationService';
import { PERFORMANCE_LEVELS, getPerformanceLevel } from './performanceLevels';

// ==========================================
// 📐 CONFIGURACIÓN DE PÁGINA
// ==========================================

// Tamaño carta con márgenes profesionales
const PAGE_CONFIG = {
    width: 215.9,      // 8.5 inches en mm
    height: 279.4,     // 11 inches en mm
    margin: {
        top: 20,
        bottom: 25,
        left: 18,
        right: 18
    }
};

const CONTENT_WIDTH = PAGE_CONFIG.width - PAGE_CONFIG.margin.left - PAGE_CONFIG.margin.right;

// Área segura para evitar cortes en los márgenes
const SAFE_AREA = {
    top: PAGE_CONFIG.margin.top,
    bottom: PAGE_CONFIG.height - PAGE_CONFIG.margin.bottom, // Límite inferior seguro
    left: PAGE_CONFIG.margin.left,
    right: PAGE_CONFIG.width - PAGE_CONFIG.margin.right
};

// Altura mínima requerida para diferentes elementos
const MIN_HEIGHTS = {
    sectionHeader: 20,
    card: 30,
    tableRow: 15,
    paragraph: 20,
    competency: 15,
    recommendation: 18,
    syllabusCategory: 25
};

/**
 * Verifica si hay espacio suficiente en la página actual
 * Si no hay espacio, crea una nueva página y retorna la posición Y inicial
 * @param {jsPDF} doc - Documento PDF
 * @param {number} currentY - Posición Y actual
 * @param {number} requiredHeight - Altura requerida para el elemento
 * @returns {number} - Nueva posición Y (puede ser en nueva página)
 */
function ensureSpace(doc, currentY, requiredHeight) {
    if (currentY + requiredHeight > SAFE_AREA.bottom) {
        doc.addPage();
        return PAGE_CONFIG.margin.top;
    }
    return currentY;
}

// ==========================================
// 🎨 PALETA DE COLORES NUCLEUS (Fiel a la web)
// ==========================================

const COLORS = {
    // Backgrounds
    bgDark: [15, 23, 42],           // Slate 900 - Fondo principal
    bgCard: [30, 41, 59],           // Slate 800 - Cards
    bgLight: [248, 250, 252],       // Slate 50 - Fondos claros
    bgGlass: [241, 245, 249],       // Slate 100

    // Primarios
    primary: [99, 102, 241],        // Indigo 500
    primaryDark: [79, 70, 229],     // Indigo 600
    secondary: [139, 92, 246],      // Violet 500

    // Estados
    success: [16, 185, 129],        // Emerald 500
    successLight: [209, 250, 229],  // Emerald 100
    warning: [245, 158, 11],        // Amber 500
    warningLight: [254, 243, 199],  // Amber 100
    danger: [239, 68, 68],          // Red 500
    dangerLight: [254, 226, 226],   // Red 100
    info: [6, 182, 212],            // Cyan 500
    infoLight: [207, 250, 254],     // Cyan 100

    // Textos
    textWhite: [255, 255, 255],
    textPrimary: [15, 23, 42],      // Slate 900
    textSecondary: [71, 85, 105],   // Slate 600
    textMuted: [148, 163, 184],     // Slate 400

    // Especiales
    gold: [234, 179, 8],            // Yellow 500 (para badges)
    purple: [168, 85, 247],         // Purple 500
};

// Colores por área (exactos de la plataforma)
const AREA_COLORS = {
    'matematicas': {
        primary: [244, 63, 94],      // Rose 500
        light: [255, 228, 230],      // Rose 100
        gradient: [[244, 63, 94], [236, 72, 153]]  // Rose -> Pink
    },
    'lectura critica': {
        primary: [6, 182, 212],      // Cyan 500
        light: [207, 250, 254],      // Cyan 100
        gradient: [[6, 182, 212], [59, 130, 246]]   // Cyan -> Blue
    },
    'ciencias naturales': {
        primary: [16, 185, 129],     // Emerald 500
        light: [209, 250, 229],      // Emerald 100
        gradient: [[16, 185, 129], [20, 184, 166]]  // Emerald -> Teal
    },
    'sociales y ciudadanas': {
        primary: [245, 158, 11],     // Amber 500
        light: [254, 243, 199],      // Amber 100
        gradient: [[245, 158, 11], [249, 115, 22]]  // Amber -> Orange
    },
    'ingles': {
        primary: [168, 85, 247],     // Purple 500
        light: [243, 232, 255],      // Purple 100
        gradient: [[168, 85, 247], [139, 92, 246]]  // Purple -> Violet
    }
};

// ==========================================
// 📄 FUNCIÓN PRINCIPAL DE EXPORTACIÓN
// ==========================================

export function exportDetailedAnalysisPDF(user) {
    if (!user) {
        console.error('❌ NUCLEUS PDF: No se proporcionaron datos del estudiante');
        return;
    }

    console.log('📄 NUCLEUS PDF: Iniciando generación de reporte profesional...');

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    // ========== PÁGINA 1: PORTADA PROFESIONAL ==========
    renderProfessionalCover(doc, user);

    // ========== PÁGINA 2: DIAGNÓSTICO GLOBAL ==========
    doc.addPage();
    renderGlobalDiagnostic(doc, user);

    // ========== PÁGINAS POR ÁREA: ANÁLISIS DETALLADO ==========
    if (user.areas) {
        Object.entries(user.areas).forEach(([areaKey, areaData]) => {
            doc.addPage();
            renderAreaDetailedAnalysis(doc, areaKey, areaData);
        });
    }

    // ========== PÁGINA FINAL: PLAN DE ACCIÓN ==========
    doc.addPage();
    renderActionPlan(doc, user);

    // ========== AGREGAR FOOTERS ==========
    addProfessionalFooters(doc);

    // ========== GUARDAR PDF ==========
    const fileName = `NUCLEUS_Analisis_Detallado_${user.name?.replace(/\s+/g, '_') || 'Estudiante'}.pdf`;
    doc.save(fileName);

    console.log('✅ NUCLEUS PDF: Reporte generado exitosamente:', fileName);
}

// ==========================================
// 📑 PÁGINA 1: PORTADA PROFESIONAL
// ==========================================

function renderProfessionalCover(doc, user) {
    const { margin } = PAGE_CONFIG;
    let y = 0;

    // === HEADER CON GRADIENTE SIMULADO ===
    // Fondo oscuro principal
    doc.setFillColor(...COLORS.bgDark);
    doc.rect(0, 0, PAGE_CONFIG.width, 85, 'F');

    // Franja decorativa con color primario
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 85, PAGE_CONFIG.width, 3, 'F');

    // Logo/Título principal
    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('NUCLEUS', PAGE_CONFIG.width / 2, 38, { align: 'center' });

    // Subtítulo con efecto de gradiente (texto)
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.primary);
    doc.text('ANALYTICS PLATFORM', PAGE_CONFIG.width / 2, 52, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Sistema de Análisis de Desempeño Académico', PAGE_CONFIG.width / 2, 65, { align: 'center' });

    doc.setFontSize(8);
    doc.text('Basado en el Marco de Referencia ICFES 2026', PAGE_CONFIG.width / 2, 75, { align: 'center' });

    y = 105;

    // === CARD DE IDENTIFICACIÓN DEL ESTUDIANTE ===
    drawPremiumCard(doc, margin.left, y, CONTENT_WIDTH, 55, {
        borderColor: COLORS.primary,
        shadowOffset: 2
    });

    // Etiqueta
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(margin.left + 10, y + 5, 60, 6, 1, 1, 'F');
    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE ANÁLISIS', margin.left + 15, y + 9.5);

    // Nombre del estudiante
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name || 'Estudiante', margin.left + 15, y + 28);

    // Información adicional
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textSecondary);

    const dateStr = new Date().toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Fecha de generación: ${dateStr}`, margin.left + 15, y + 38);
    doc.text(`ID: ${user.id || 'N/A'}`, margin.left + 15, y + 46);

    y += 70;

    // === PUNTAJE GLOBAL DESTACADO ===
    const globalScore = user.global_score || 0;
    const classification = classifyGlobalScore(globalScore);

    // Card oscura para el puntaje
    doc.setFillColor(...COLORS.bgDark);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 65, 4, 4, 'F');

    // Título
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PUNTAJE GLOBAL SABER 11°', PAGE_CONFIG.width / 2, y + 15, { align: 'center' });

    // Línea decorativa
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.line(margin.left + 50, y + 20, PAGE_CONFIG.width - margin.right - 50, y + 20);

    // Puntaje grande
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(52);
    doc.setFont('helvetica', 'bold');
    doc.text(`${globalScore}`, PAGE_CONFIG.width / 2 - 15, y + 48, { align: 'center' });

    // "/500"
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('/ 500', PAGE_CONFIG.width / 2 + 35, y + 48, { align: 'left' });

    // Badge de clasificación
    const classColor = getClassificationColor(classification.key);
    doc.setFillColor(...classColor);
    doc.roundedRect(PAGE_CONFIG.width / 2 - 30, y + 52, 60, 10, 3, 3, 'F');
    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(classification.label.toUpperCase(), PAGE_CONFIG.width / 2, y + 59, { align: 'center' });

    y += 80;

    // === RESUMEN VISUAL DE ÁREAS ===
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Desempeño por Áreas', margin.left, y);
    y += 8;

    if (user.areas) {
        const areaEntries = Object.entries(user.areas);
        const cardHeight = 40;
        const spacing = 5;
        const cardWidth = (CONTENT_WIDTH - (spacing * (areaEntries.length - 1))) / areaEntries.length;

        areaEntries.forEach(([areaKey, areaData], index) => {
            const areaColorConfig = AREA_COLORS[areaKey] || { primary: COLORS.primary, light: COLORS.bgLight };
            const x = margin.left + (index * (cardWidth + spacing));

            // Card del área
            doc.setFillColor(...areaColorConfig.primary);
            doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');

            // Nombre del área
            doc.setTextColor(...COLORS.textWhite);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            const areaName = getAreaShortName(areaKey);
            doc.text(areaName, x + cardWidth / 2, y + 10, { align: 'center' });

            // Puntaje
            doc.setFontSize(18);
            doc.text(`${areaData.score || 0}`, x + cardWidth / 2, y + 26, { align: 'center' });

            // Indicador
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text('puntos', x + cardWidth / 2, y + 34, { align: 'center' });
        });
    }

    y += 55;

    // === NOTA INFORMATIVA ===
    doc.setFillColor(...COLORS.bgLight);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 30, 3, 3, 'F');

    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const infoText = [
        'Este documento contiene un análisis exhaustivo de tu desempeño académico.',
        'Incluye diagnóstico por competencias, syllabus de estudio personalizado,',
        'y un plan de acción basado en el Marco de Referencia ICFES 2026.'
    ];
    infoText.forEach((line, i) => {
        doc.text(line, PAGE_CONFIG.width / 2, y + 10 + (i * 8), { align: 'center' });
    });

    return y + 40;
}

// ==========================================
// 📊 PÁGINA 2: DIAGNÓSTICO GLOBAL
// ==========================================

function renderGlobalDiagnostic(doc, user) {
    const { margin } = PAGE_CONFIG;
    let y = margin.top;

    // === HEADER DE SECCIÓN ===
    y = renderSectionHeader(doc, y, 'DIAGNÓSTICO GLOBAL', '📊');
    y += 10;

    const globalScore = user.global_score || 0;
    const classification = classifyGlobalScore(globalScore);
    const plan = getStrategicPlan(classification.key);

    // === CLASIFICACIÓN ACTUAL ===
    doc.setFillColor(...COLORS.bgDark);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 40, 3, 3, 'F');

    // Lado izquierdo: Info de clasificación
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Tu clasificación actual:', margin.left + 10, y + 12);

    const classColor = getClassificationColor(classification.key);
    doc.setTextColor(...classColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(classification.label, margin.left + 10, y + 25);

    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(classification.description || '', margin.left + 10, y + 34);

    // Lado derecho: Barra de progreso visual
    const barX = PAGE_CONFIG.width - margin.right - 110;
    const barWidth = 100;
    const barHeight = 12;

    // Etiqueta
    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(8);
    doc.text('Progreso hacia meta (500 pts)', barX, y + 10);

    // Fondo de la barra
    doc.setFillColor(...COLORS.bgCard);
    doc.roundedRect(barX, y + 14, barWidth, barHeight, 3, 3, 'F');

    // Progreso
    const progress = Math.min(100, (globalScore / 500) * 100);
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(barX, y + 14, barWidth * (progress / 100), barHeight, 3, 3, 'F');

    // Porcentaje
    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${Math.round(progress)}%`, barX + barWidth / 2, y + 22, { align: 'center' });

    y += 50;

    // === ESCALA DE CLASIFICACIONES ===
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Escala de Clasificaciones ICFES', margin.left, y);
    y += 10;

    const ranges = [
        { label: 'Crítico', range: '0-249', color: COLORS.danger, key: 'Critical' },
        { label: 'En Desarrollo', range: '250-299', color: COLORS.warning, key: 'Developing' },
        { label: 'Competente', range: '300-349', color: COLORS.info, key: 'Competent' },
        { label: 'Avanzado', range: '350-399', color: COLORS.success, key: 'Advanced' },
        { label: 'Elite', range: '400-500', color: COLORS.secondary, key: 'Elite' },
    ];

    const rangeWidth = (CONTENT_WIDTH - 20) / ranges.length;
    ranges.forEach((range, i) => {
        const x = margin.left + (i * (rangeWidth + 4));
        const isCurrentRange = classification.key === range.key;

        // Card del rango
        doc.setFillColor(...range.color);
        if (isCurrentRange) {
            // Borde destacado para el rango actual
            doc.setDrawColor(...COLORS.textPrimary);
            doc.setLineWidth(1.5);
            doc.roundedRect(x, y, rangeWidth, 22, 2, 2, 'FD');
        } else {
            doc.roundedRect(x, y, rangeWidth, 22, 2, 2, 'F');
        }

        doc.setTextColor(...COLORS.textWhite);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(range.label, x + rangeWidth / 2, y + 9, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(range.range, x + rangeWidth / 2, y + 17, { align: 'center' });

        // Indicador de posición actual
        if (isCurrentRange) {
            doc.setFillColor(...COLORS.textPrimary);
            doc.circle(x + rangeWidth / 2, y - 3, 2, 'F');
        }
    });

    y += 35;

    // === TABLA DE PUNTAJES POR ÁREA ===
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Desglose de Puntajes por Área', margin.left, y);
    y += 5;

    if (user.areas) {
        const areaTableData = Object.entries(user.areas).map(([areaKey, areaData]) => {
            const level = getPerformanceLevel(areaKey, areaData.score || 0);
            const correct = areaData.correct || 0;
            const total = areaData.total || 0;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

            return [
                getAreaDisplayName(areaKey),
                `${areaData.score || 0}`,
                `${correct}/${total}`,
                `${percentage}%`,
                level?.badge || 'N/A'
            ];
        });

        autoTable(doc, {
            startY: y,
            head: [['Área', 'Puntaje', 'Aciertos', 'Efectividad', 'Nivel']],
            body: areaTableData,
            theme: 'plain',
            headStyles: {
                fillColor: COLORS.bgDark,
                textColor: COLORS.textWhite,
                fontSize: 9,
                fontStyle: 'bold',
                cellPadding: 4
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 4
            },
            alternateRowStyles: {
                fillColor: COLORS.bgLight
            },
            columnStyles: {
                0: { fontStyle: 'bold', halign: 'left' },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' }
            },
            margin: { left: margin.left, right: margin.right }
        });

        y = doc.lastAutoTable.finalY + 15;
    }

    // === GRÁFICO DE BARRAS HORIZONTAL ===
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Visualización de Desempeño', margin.left, y);
    y += 10;

    if (user.areas) {
        const barHeight = 12;
        const labelWidth = 55;
        const maxBarWidth = CONTENT_WIDTH - labelWidth - 30;

        Object.entries(user.areas).forEach(([areaKey, areaData]) => {
            const areaColorConfig = AREA_COLORS[areaKey] || { primary: COLORS.primary };
            const score = areaData.score || 0;
            const barWidth = (score / 100) * maxBarWidth;

            // Label
            doc.setTextColor(...COLORS.textSecondary);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(getAreaShortName(areaKey), margin.left, y + 8);

            // Fondo de barra
            doc.setFillColor(...COLORS.bgLight);
            doc.roundedRect(margin.left + labelWidth, y, maxBarWidth, barHeight, 2, 2, 'F');

            // Barra de progreso
            doc.setFillColor(...areaColorConfig.primary);
            doc.roundedRect(margin.left + labelWidth, y, barWidth, barHeight, 2, 2, 'F');

            // Valor
            doc.setTextColor(...COLORS.textPrimary);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(`${score}`, margin.left + labelWidth + maxBarWidth + 5, y + 8);

            y += barHeight + 6;
        });
    }

    y += 10;

    // === DISTRIBUCIÓN DE TIEMPO RECOMENDADO ===
    if (y < PAGE_CONFIG.height - 80) {
        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Distribución Semanal Recomendada', margin.left, y);
        y += 8;

        // Card con el tiempo
        doc.setFillColor(...COLORS.bgDark);
        doc.roundedRect(margin.left, y, CONTENT_WIDTH, 35, 3, 3, 'F');

        // Horas totales
        doc.setTextColor(...COLORS.textMuted);
        doc.setFontSize(8);
        doc.text('Intensidad semanal sugerida:', margin.left + 10, y + 12);

        doc.setTextColor(...COLORS.primary);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(`${plan.weeklyHours}`, margin.left + 10, y + 28);
        doc.setFontSize(12);
        doc.text('horas', margin.left + 35, y + 28);

        // Mini barras por área
        const miniBarWidth = 80;
        const miniBarX = PAGE_CONFIG.width - margin.right - miniBarWidth - 10;

        Object.entries(plan.timeAllocation).slice(0, 3).forEach(([area, hours], i) => {
            const percentage = (hours / plan.weeklyHours) * 100;
            const barW = (percentage / 100) * miniBarWidth;

            doc.setFillColor(...COLORS.bgCard);
            doc.roundedRect(miniBarX, y + 8 + (i * 9), miniBarWidth, 6, 1, 1, 'F');

            doc.setFillColor(...COLORS.primary);
            doc.roundedRect(miniBarX, y + 8 + (i * 9), barW, 6, 1, 1, 'F');

            doc.setTextColor(...COLORS.textMuted);
            doc.setFontSize(6);
            doc.text(area.substring(0, 10), miniBarX - 35, y + 12 + (i * 9));
        });
    }

    return y;
}

// ==========================================
// 📚 ANÁLISIS DETALLADO POR ÁREA
// ==========================================

function renderAreaDetailedAnalysis(doc, areaKey, areaData) {
    const { margin } = PAGE_CONFIG;
    const areaColorConfig = AREA_COLORS[areaKey] || { primary: COLORS.primary, light: COLORS.bgLight };
    const areaConfig = PERFORMANCE_LEVELS[areaKey];
    const level = getPerformanceLevel(areaKey, areaData.score || 0);

    if (!areaConfig || !level) return;

    let y = 0;

    // === HEADER CON COLOR DEL ÁREA ===
    doc.setFillColor(...areaColorConfig.primary);
    doc.rect(0, 0, PAGE_CONFIG.width, 30, 'F');

    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${areaConfig.icon || '📚'} ${areaConfig.name}`, PAGE_CONFIG.width / 2, 18, { align: 'center' });

    y = 40;

    // === MÉTRICAS PRINCIPALES ===
    const metricsCardWidth = (CONTENT_WIDTH - 15) / 3;
    const metrics = [
        {
            label: 'PUNTAJE',
            value: `${areaData.score || 0}`,
            subtext: 'de 100 puntos',
            highlight: true
        },
        {
            label: 'ACIERTOS',
            value: `${areaData.correct || 0}/${areaData.total || 0}`,
            subtext: `${areaData.total > 0 ? Math.round((areaData.correct / areaData.total) * 100) : 0}% efectividad`
        },
        {
            label: 'NIVEL',
            value: level.badge,
            subtext: level.title?.split(' - ')[1] || 'Nivel de desempeño'
        }
    ];

    metrics.forEach((metric, i) => {
        const x = margin.left + (i * (metricsCardWidth + 7));

        // Card
        doc.setFillColor(...(metric.highlight ? areaColorConfig.light : COLORS.bgLight));
        doc.roundedRect(x, y, metricsCardWidth, 32, 3, 3, 'F');

        // Borde superior con color del área si es highlight
        if (metric.highlight) {
            doc.setFillColor(...areaColorConfig.primary);
            doc.roundedRect(x, y, metricsCardWidth, 3, 1, 1, 'F');
        }

        // Label
        doc.setTextColor(...COLORS.textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(metric.label, x + metricsCardWidth / 2, y + 10, { align: 'center' });

        // Valor
        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(16);
        doc.text(metric.value, x + metricsCardWidth / 2, y + 22, { align: 'center' });

        // Subtext
        doc.setTextColor(...COLORS.textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(metric.subtext, x + metricsCardWidth / 2, y + 29, { align: 'center' });
    });

    y += 42;

    // === DESCRIPCIÓN DEL NIVEL ===
    const levelBgColor = getLevelBackgroundColor(level.color);
    const levelTextColor = getLevelTextColor(level.color);

    doc.setFillColor(...levelBgColor);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 25, 3, 3, 'F');

    doc.setTextColor(...levelTextColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nivel ${level.badge}:`, margin.left + 8, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const descLines = doc.splitTextToSize(level.description || 'Descripción no disponible', CONTENT_WIDTH - 16);
    doc.text(descLines, margin.left + 8, y + 18);

    y += 32;

    // === COMPETENCIAS DEL NIVEL ===
    if (level.competencies && level.competencies.length > 0) {
        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('✅ Competencias que demuestras en este nivel', margin.left, y);
        y += 8;

        level.competencies.forEach((comp, i) => {
            // Verificar espacio antes de renderizar competencia
            y = ensureSpace(doc, y, MIN_HEIGHTS.competency);

            doc.setFillColor(...COLORS.bgLight);
            doc.roundedRect(margin.left, y, CONTENT_WIDTH, 10, 2, 2, 'F');

            doc.setTextColor(...areaColorConfig.primary);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(`${i + 1}`, margin.left + 5, y + 7);

            doc.setTextColor(...COLORS.textSecondary);
            doc.setFont('helvetica', 'normal');
            doc.text(comp, margin.left + 12, y + 7);

            y += 12;
        });
    }

    y += 8;

    // === SYLLABUS DE ESTUDIO ===
    if (level.syllabus && Object.keys(level.syllabus).length > 0) {
        // Verificar espacio para título del syllabus
        y = ensureSpace(doc, y, MIN_HEIGHTS.sectionHeader);

        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('📚 Syllabus de Estudio Recomendado', margin.left, y);
        y += 10;

        Object.entries(level.syllabus).forEach(([category, topics]) => {
            // Verificar espacio para categoría del syllabus
            y = ensureSpace(doc, y, MIN_HEIGHTS.syllabusCategory);

            // Encabezado de categoría
            doc.setFillColor(...areaColorConfig.primary);
            doc.roundedRect(margin.left, y, CONTENT_WIDTH, 8, 2, 2, 'F');
            doc.setTextColor(...COLORS.textWhite);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(category, margin.left + 5, y + 5.5);
            y += 11;

            // Temas en dos columnas si hay espacio
            const colWidth = (CONTENT_WIDTH - 10) / 2;
            topics.forEach((topic, i) => {
                // Verificar espacio para tema
                y = ensureSpace(doc, y, 8);

                const col = i % 2;
                const x = margin.left + 5 + (col * colWidth);

                if (col === 0 || i === 0) {
                    // Nueva fila
                }

                doc.setTextColor(...COLORS.textSecondary);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');

                const topicText = `• ${topic}`;
                const topicLines = doc.splitTextToSize(topicText, colWidth - 5);
                doc.text(topicLines[0], x, y);

                if (col === 1 || i === topics.length - 1) {
                    y += 5;
                }
            });
            y += 5;
        });
    }

    y += 8;

    // === RECOMENDACIONES ===
    if (level.recommendations && level.recommendations.length > 0) {
        // Verificar espacio para título del syllabus
        y = ensureSpace(doc, y, MIN_HEIGHTS.sectionHeader);

        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('💡 Recomendaciones de Mejora', margin.left, y);
        y += 8;

        level.recommendations.forEach((rec, i) => {
            // Verificar espacio para recomendación
            y = ensureSpace(doc, y, MIN_HEIGHTS.recommendation);

            doc.setFillColor(...COLORS.bgLight);
            doc.roundedRect(margin.left, y, CONTENT_WIDTH, 12, 2, 2, 'F');

            // Número
            doc.setFillColor(...areaColorConfig.primary);
            doc.circle(margin.left + 8, y + 6, 4, 'F');
            doc.setTextColor(...COLORS.textWhite);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(`${i + 1}`, margin.left + 8, y + 7.5, { align: 'center' });

            // Texto
            doc.setTextColor(...COLORS.textSecondary);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            const recLines = doc.splitTextToSize(rec, CONTENT_WIDTH - 25);
            doc.text(recLines[0], margin.left + 18, y + 7.5);

            y += 15;
        });
    }

    return y;
}

// ==========================================
// 📋 PLAN DE ACCIÓN PERSONALIZADO
// ==========================================

function renderActionPlan(doc, user) {
    const { margin } = PAGE_CONFIG;
    let y = 0;

    // === HEADER ===
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, PAGE_CONFIG.width, 30, 'F');

    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('📋 PLAN DE ACCIÓN PERSONALIZADO', PAGE_CONFIG.width / 2, 18, { align: 'center' });

    y = 45;

    const globalScore = user.global_score || 0;
    classifyGlobalScore(globalScore); // Para validación, pero no usamos el resultado aquí

    // === META PERSONAL ===
    doc.setFillColor(...COLORS.bgLight);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 25, 3, 3, 'F');

    doc.setTextColor(...COLORS.textSecondary);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Tu meta de mejora sugerida:', margin.left + 10, y + 10);

    doc.setTextColor(...COLORS.success);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const targetScore = Math.min(globalScore + 50, 500);
    doc.text(`Alcanzar ${targetScore} puntos`, margin.left + 10, y + 20);

    // Badge de incremento
    doc.setFillColor(...COLORS.success);
    doc.roundedRect(margin.left + 120, y + 12, 30, 8, 2, 2, 'F');
    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(8);
    doc.text('+50 pts', margin.left + 135, y + 17.5, { align: 'center' });

    y += 35;

    // === PASOS ESTRATÉGICOS ===
    doc.setTextColor(...COLORS.textPrimary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Pasos Estratégicos de Mejora', margin.left, y);
    y += 10;

    const steps = [
        { title: 'Análisis de Errores', desc: 'Revisa detalladamente cada pregunta incorrecta del simulacro' },
        { title: 'Estudio Focalizado', desc: 'Dedica 60% del tiempo a tus áreas más débiles' },
        { title: 'Práctica Constante', desc: 'Realiza al menos 20 preguntas diarias de práctica' },
        { title: 'Simulacros Periódicos', desc: 'Toma un simulacro completo cada 2 semanas' }
    ];

    steps.forEach((step, i) => {
        // Card del paso
        doc.setFillColor(...COLORS.bgDark);
        doc.roundedRect(margin.left, y, CONTENT_WIDTH, 18, 3, 3, 'F');

        // Número
        doc.setFillColor(...COLORS.primary);
        doc.roundedRect(margin.left + 5, y + 4, 20, 10, 2, 2, 'F');
        doc.setTextColor(...COLORS.textWhite);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`PASO ${i + 1}`, margin.left + 15, y + 11, { align: 'center' });

        // Título
        doc.setTextColor(...COLORS.textWhite);
        doc.setFontSize(10);
        doc.text(step.title, margin.left + 32, y + 8);

        // Descripción
        doc.setTextColor(...COLORS.textMuted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(step.desc, margin.left + 32, y + 15);

        y += 22;
    });

    y += 10;

    // === PRIORIDADES POR ÁREA ===
    if (user.areas) {
        doc.setTextColor(...COLORS.textPrimary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Prioridades de Estudio', margin.left, y);
        y += 10;

        // Ordenar áreas por puntaje (menor primero = mayor prioridad)
        const sortedAreas = Object.entries(user.areas)
            .sort(([, a], [, b]) => (a.score || 0) - (b.score || 0));

        sortedAreas.forEach(([areaKey, areaData], index) => {
            const areaColorConfig = AREA_COLORS[areaKey] || { primary: COLORS.primary };
            const priority = index < 2 ? 'CRÍTICA' : index < 4 ? 'MEDIA' : 'NORMAL';
            const priorityColor = index < 2 ? COLORS.danger : index < 4 ? COLORS.warning : COLORS.success;

            // Línea del área
            doc.setFillColor(...areaColorConfig.primary);
            doc.roundedRect(margin.left, y, 5, 14, 0, 0, 'F');

            doc.setFillColor(...COLORS.bgLight);
            doc.rect(margin.left + 5, y, CONTENT_WIDTH - 5, 14, 'F');

            // Posición
            doc.setTextColor(...COLORS.textMuted);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`#${index + 1}`, margin.left + 12, y + 9);

            // Nombre
            doc.setTextColor(...COLORS.textPrimary);
            doc.setFontSize(9);
            doc.text(getAreaDisplayName(areaKey), margin.left + 28, y + 9);

            // Puntaje
            doc.setTextColor(...COLORS.textMuted);
            doc.setFont('helvetica', 'normal');
            doc.text(`${areaData.score || 0} pts`, margin.left + 100, y + 9);

            // Badge de prioridad
            doc.setFillColor(...priorityColor);
            doc.roundedRect(margin.left + 130, y + 3, 40, 8, 2, 2, 'F');
            doc.setTextColor(...COLORS.textWhite);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(`PRIORIDAD ${priority}`, margin.left + 150, y + 8.5, { align: 'center' });

            y += 17;
        });
    }

    y += 15;

    // === MENSAJE MOTIVACIONAL ===
    doc.setFillColor(...COLORS.bgDark);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 40, 4, 4, 'F');

    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('💪 ¡Tú puedes lograrlo!', margin.left + 10, y + 12);

    doc.setTextColor(...COLORS.textMuted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const motivationalText = 'El éxito en el Saber 11 no depende solo de conocimientos, sino de estrategia y constancia. ' +
        'Sigue este plan, dedica tiempo diario a tu preparación y verás resultados significativos. ' +
        'Recuerda: cada hora de estudio te acerca más a tu meta.';
    const msgLines = doc.splitTextToSize(motivationalText, CONTENT_WIDTH - 20);
    doc.text(msgLines, margin.left + 10, y + 22);

    return y + 50;
}

// ==========================================
// 📄 FOOTERS PROFESIONALES
// ==========================================

function addProfessionalFooters(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    const { margin, height, width } = PAGE_CONFIG;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Línea separadora
        doc.setDrawColor(...COLORS.textMuted);
        doc.setLineWidth(0.3);
        doc.line(margin.left, height - 18, width - margin.right, height - 18);

        // Texto izquierdo
        doc.setTextColor(...COLORS.textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('NUCLEUS Analytics Platform | Sistema de Análisis Académico ICFES', margin.left, height - 12);

        // Número de página
        doc.text(`Página ${i} de ${pageCount}`, width - margin.right, height - 12, { align: 'right' });

        // Copyright
        doc.setFontSize(6);
        doc.text('© 2025 NUCLEUS Analytics - Documento generado automáticamente. Prohibida su reproducción comercial.', width / 2, height - 6, { align: 'center' });
    }
}

// ==========================================
// 🔧 UTILIDADES
// ==========================================

function drawPremiumCard(doc, x, y, width, height, options = {}) {
    const { borderColor = COLORS.textMuted, shadowOffset = 1 } = options;

    // Sombra sutil
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(x + shadowOffset, y + shadowOffset, width, height, 4, 4, 'F');

    // Card principal
    doc.setFillColor(...COLORS.bgLight);
    doc.roundedRect(x, y, width, height, 4, 4, 'F');

    // Borde
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, height, 4, 4, 'S');
}

function renderSectionHeader(doc, y, title, icon = '') {
    const { margin } = PAGE_CONFIG;

    doc.setFillColor(...COLORS.bgDark);
    doc.roundedRect(margin.left, y, CONTENT_WIDTH, 14, 3, 3, 'F');

    doc.setTextColor(...COLORS.textWhite);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${icon} ${title}`, margin.left + 8, y + 10);

    return y + 18;
}

function getAreaDisplayName(areaKey) {
    const names = {
        'matematicas': 'Matemáticas',
        'lectura critica': 'Lectura Crítica',
        'ciencias naturales': 'Ciencias Naturales',
        'sociales y ciudadanas': 'Sociales y Ciudadanas',
        'ingles': 'Inglés'
    };
    return names[areaKey] || areaKey;
}

function getAreaShortName(areaKey) {
    const names = {
        'matematicas': 'Matemáticas',
        'lectura critica': 'L. Crítica',
        'ciencias naturales': 'C. Naturales',
        'sociales y ciudadanas': 'Sociales',
        'ingles': 'Inglés'
    };
    return names[areaKey] || areaKey;
}

function getClassificationColor(key) {
    const colors = {
        'Critical': COLORS.danger,
        'Developing': COLORS.warning,
        'Competent': COLORS.info,
        'Advanced': COLORS.success,
        'Elite': COLORS.secondary
    };
    return colors[key] || COLORS.primary;
}

function getLevelBackgroundColor(color) {
    const colors = {
        'red': COLORS.dangerLight,
        'amber': COLORS.warningLight,
        'cyan': COLORS.infoLight,
        'emerald': COLORS.successLight
    };
    return colors[color] || COLORS.bgLight;
}

function getLevelTextColor(color) {
    const colors = {
        'red': [153, 27, 27],        // Red 800
        'amber': [146, 64, 14],      // Amber 800
        'cyan': [21, 94, 117],       // Cyan 800
        'emerald': [6, 95, 70]       // Emerald 800
    };
    return colors[color] || COLORS.textPrimary;
}

export default exportDetailedAnalysisPDF;
