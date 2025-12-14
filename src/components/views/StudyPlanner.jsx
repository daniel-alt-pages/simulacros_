import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Save, Download, Sparkles, BookOpen, Clock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import TimeSlotSelector from '../planning/TimeSlotSelector';
import { generatePersonalizedPlan, exportPlanToPDF } from '../../services/studyPlanGenerator';
import { saveStudyPlan } from '../../services/firebase';

export default function StudyPlanner({ user }) {
    const [availability, setAvailability] = useState({});
    const [generatedPlan, setGeneratedPlan] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error

    // Load existing plan from LocalStorage
    useEffect(() => {
        async function loadExistingPlan() {
            if (user?.id) {
                try {
                    // Local Storage implementation
                    const saved = localStorage.getItem(`nucleus_study_plan_${user.id}`);
                    if (saved) {
                        const parsedPlan = JSON.parse(saved);
                        console.log("Plan recuperado de LocalStorage:", parsedPlan);
                        setGeneratedPlan(parsedPlan);
                        if (parsedPlan.availability) {
                            setAvailability(parsedPlan.availability);
                        }
                        setSaveStatus('success');
                    }
                } catch (error) {
                    console.error("Error cargando plan local:", error);
                }
            }
        }
        loadExistingPlan();
    }, [user]);

    // Extraer puntajes del usuario de forma segura
    const getScores = () => {
        const scores = {};
        if (user && user.areas) {
            Object.entries(user.areas).forEach(([key, data]) => {
                scores[key] = data.score;
            });
        }
        return scores;
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simular proceso de "pensamiento" de IA
        setTimeout(async () => {
            const plan = generatePersonalizedPlan(
                user.name,
                getScores(),
                availability
            );
            setGeneratedPlan(plan);
            setIsGenerating(false);

            // Auto-guardado local al generar
            try {
                localStorage.setItem(`nucleus_study_plan_${user.id}`, JSON.stringify(plan));
                setSaveStatus('idle'); // Reset status to prompt cloud save
            } catch (e) {
                console.error("Error saving to localStorage", e);
            }
        }, 1500);
    };

    const handleSaveToCloud = async () => {
        if (!generatedPlan || !user?.id) return;
        setSaveStatus('saving');

        // 1. Save to Firebase (Cloud)
        const success = await saveStudyPlan(user.id, generatedPlan);

        if (success) {
            setSaveStatus('success');
            // 2. Update LocalStorage backup
            localStorage.setItem(`nucleus_study_plan_${user.id}`, JSON.stringify(generatedPlan));
        } else {
            setSaveStatus('error');
            alert("No se pudo conectar con la nube. Verifica tu conexión.");
        }
    };

    const handleExportPDF = () => {
        if (generatedPlan) exportPlanToPDF(generatedPlan);
    };

    if (!user) return <div className="text-white">Cargando perfil...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        Generador de Rutas de Aprendizaje
                    </h1>
                    <p className="text-slate-400">
                        Diseña tu estrategia personalizada basada en tu tiempo real disponible.
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center gap-3">
                        <Sparkles size={20} className="text-indigo-400" />
                        <span className="text-sm font-bold text-indigo-300">Powered by NUCLEUS Engine</span>
                    </div>
                </div>
            </div>

            {/* Paso 1: Disponibilidad */}
            <TimeSlotSelector onChange={setAvailability} />

            {/* Acción Principal */}
            <div className="flex justify-center">
                <button
                    onClick={handleGenerate}
                    disabled={Object.keys(availability).length === 0 || isGenerating}
                    className={`
                        group relative overflow-hidden rounded-2xl px-12 py-5 font-black text-lg transition-all
                        ${Object.keys(availability).length === 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:scale-105 active:scale-95'}
                    `}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {isGenerating ? (
                            <>
                                <Sparkles className="animate-spin" /> Analizando Brechas...
                            </>
                        ) : (
                            <>
                                <Sparkles className="group-hover:rotate-12 transition-transform" />
                                GENERAR MI RUTA INTELIGENTE
                            </>
                        )}
                    </span>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-xl"></div>
                </button>
            </div>

            {/* Resultados del Plan */}
            <AnimatePresence>
                {generatedPlan && !generatedPlan.error && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 my-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tu Ruta Personalizada</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                        </div>

                        {/* Toolbar de Acciones */}
                        <div className="flex flex-wrap gap-4 justify-end mb-4">
                            <button
                                onClick={handleSaveToCloud}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${saveStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    saveStatus === 'saving' ? 'bg-slate-800 text-slate-400 cursor-wait' :
                                        'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                                    }`}
                            >
                                {saveStatus === 'success' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                                {saveStatus === 'success' ? 'Guardado en Nube' : saveStatus === 'saving' ? 'Guardando...' : 'Guardar Progreso'}
                            </button>

                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                <Download size={18} /> Descargar PDF Oficial
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Clock size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase">Intensidad Semanal</h4>
                                    <p className="text-xl font-black text-white">{generatedPlan.totalHours} Horas</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><CheckCircle2 size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase">Sesiones</h4>
                                    <p className="text-xl font-black text-white">{generatedPlan.schedule.length} Bloques</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><BookOpen size={20} /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase">Estrategia</h4>
                                    <p className="text-lg font-bold text-white leading-tight">Nivelación Intensiva</p>
                                </div>
                            </div>
                        </div>

                        {/* Premium Timeline Visual */}
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent opacity-30 hidden md:block"></div>

                            <div className="space-y-12">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, dayIdx) => {
                                    const dayEvents = generatedPlan.schedule.filter(s => s.dayName === day);
                                    if (dayEvents.length === 0) return null;

                                    return (
                                        <div key={day} className="relative md:pl-12">
                                            {/* Date Node */}
                                            <div className="absolute left-[9px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500 hidden md:block z-10 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

                                            <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                                <span className="text-indigo-400 opacity-50 text-lg">0{dayIdx + 1}</span> {day}
                                            </h4>

                                            <div className="grid gap-4">
                                                {dayEvents.map((event, idx) => {
                                                    // Map color class string to actual border/bg colors dynamically
                                                    const colorMap = {
                                                        'red': 'border-l-red-500 bg-red-500/5',
                                                        'amber': 'border-l-amber-500 bg-amber-500/5',
                                                        'cyan': 'border-l-cyan-500 bg-cyan-500/5',
                                                        'emerald': 'border-l-emerald-500 bg-emerald-500/5',
                                                        'purple': 'border-l-purple-500 bg-purple-500/5'
                                                    }
                                                    // Extract color key from the full class string (e.g. "from-red-500...")
                                                    let colorKey = 'indigo';
                                                    if (event.color && event.color.includes('red')) colorKey = 'red';
                                                    if (event.color && event.color.includes('amber') || event.color.includes('orange')) colorKey = 'amber';
                                                    if (event.color && event.color.includes('cyan') || event.color.includes('sky')) colorKey = 'cyan';
                                                    if (event.color && event.color.includes('emerald') || event.color.includes('green')) colorKey = 'emerald';
                                                    if (event.color && event.color.includes('purple')) colorKey = 'purple';

                                                    const styleClass = colorMap[colorKey] || 'border-l-indigo-500 bg-slate-800/50';

                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className={`
                                                                relative overflow-hidden group 
                                                                border-l-4 ${styleClass} 
                                                                bg-slate-900/80 backdrop-blur-sm border-t border-r border-b border-white/5 
                                                                p-5 rounded-r-2xl rounded-l-md shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-x-1
                                                            `}
                                                        >
                                                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                                {/* Time Badge */}
                                                                <div className="min-w-[140px] flex-shrink-0">
                                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-300 font-mono text-xs font-bold shadow-inner">
                                                                        <Clock size={14} className="text-indigo-400" />
                                                                        {event.blockLabel}
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <h5 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                                                                            {event.areaName}
                                                                        </h5>
                                                                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                                                            {event.focusLevel}
                                                                        </span>
                                                                    </div>

                                                                    <p className="text-slate-300 font-medium text-sm leading-relaxed">
                                                                        {event.topic}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {generatedPlan && generatedPlan.error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3 mt-6">
                        <AlertCircle size={20} />
                        {generatedPlan.error}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


