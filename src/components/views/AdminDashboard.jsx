import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, ScatterChart, Scatter, ZAxis, Legend, Area, AreaChart,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    Users, TrendingUp, Award, Target, Search, Filter, BookOpen, AlertCircle,
    CheckCircle2, Brain, TrendingDown, Zap,
    Activity, AlertTriangle, Star, Trophy, Sparkles, Crosshair, Hexagon, Layers,
    LayoutDashboard, FileQuestion, Video, Settings, Save, Download, PlayCircle,
    MoreVertical, Share2, Plus, View, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentAnalyticsEngine } from '../../services/analyticsEngine';
import StudentDashboard from './StudentDashboard';
import QuestionStatsModal from '../modals/QuestionStatsModal';

// --- CONFIGURACIÓN VISUAL ---
const THEME = {
    colors: {
        primary: '#6366f1', // Indigo Neon
        secondary: '#06b6d4', // Cyan Cyber
        accent: '#f59e0b', // Amber Warning
        danger: '#ef4444', // Red Critical
        success: '#10b981', // Emerald Success
        background: '#0f172a', // Slate 900
    }
};

const SUBJECTS = [
    { id: 'matematicas', name: 'Matemáticas', color: '#818cf8', icon: '📐' },
    { id: 'lectura critica', name: 'Lectura Crítica', color: '#22d3ee', icon: '📚' },
    { id: 'sociales y ciudadanas', name: 'Sociales', color: '#fbbf24', icon: '🌍' },
    { id: 'ciencias naturales', name: 'Ciencias', color: '#34d399', icon: '🧬' },
    { id: 'ingles', name: 'Inglés', color: '#f472b6', icon: '🗣️' }
];

const SCORE_RANGES = [
    { key: 'critic', label: 'Retaguardia', min: 0, max: 200, color: '#ef4444' },
    { key: 'core', label: 'Núcleo', min: 201, max: 350, color: '#3b82f6' },
    { key: 'vanguard', label: 'Vanguardia', min: 351, max: 500, color: '#10b981' }
];

// --- COMPONENTE PRINCIPAL ---
export default function AdminDashboard({ db }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedQuestionStats, setSelectedQuestionStats] = useState(null);

    // Estado local para grabaciones (simulado, se reinicia al recargar)
    const [recordings, setRecordings] = useState([
        { id: 1, title: 'Retroalimentación Simulacro #1 - Matemáticas', date: '2023-11-15', type: 'video', url: '#', duration: '45 min' },
        { id: 2, title: 'Análisis Lectura Crítica - Fallos Comunes', date: '2023-11-16', type: 'video', url: '#', duration: '32 min' },
    ]);
    const [showToast, setShowToast] = useState(false);

    const handleAddRecording = () => {
        const title = prompt("Título del nuevo recurso:");
        if (title) {
            setRecordings(prev => [{
                id: Date.now(),
                title,
                date: new Date().toISOString().split('T')[0],
                type: 'video',
                url: '#',
                duration: 'Pendiente'
            }, ...prev]);
            saveSettings();
        }
    };

    const saveSettings = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // 1. DATA SCIENCE CORE
    const stats = useMemo(() => {
        if (!db?.students || db.students.length === 0) return null;
        const students = db.students;
        const total = students.length;

        // Global Stats with validation
        const scores = students.map(s => s.global_score || 0).filter(s => s > 0);
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const max = scores.length > 0 ? Math.max(...scores) : 0;

        // Distribution
        const distribution = SCORE_RANGES.map(r => ({
            name: r.label,
            value: students.filter(s => (s.global_score || 0) >= r.min && (s.global_score || 0) <= r.max).length,
            color: r.color
        }));

        // Subject Averages with validation
        const subjectAverages = SUBJECTS.map(sub => {
            const subScores = students
                .map(s => s.areas?.[sub.id]?.score)
                .filter(score => score !== undefined && score !== null && !isNaN(score));

            const avg = subScores.length > 0
                ? Math.round(subScores.reduce((a, b) => a + b, 0) / subScores.length)
                : 0;

            return {
                subject: sub.name,
                avg: avg,
                fullMark: 100
            };
        }).sort((a, b) => a.avg - b.avg);

        // --- QUESTION ANALYTICS ENGINE ---
        const questionStats = {};
        SUBJECTS.forEach(sub => {
            const questionMap = {};

            students.forEach(s => {
                const area = s.areas?.[sub.id];
                if (!area || !area.question_details) return;

                area.question_details.forEach(q => {
                    if (!q || !q.id) return; // Skip invalid questions

                    if (!questionMap[q.id]) {
                        questionMap[q.id] = {
                            id: q.id,
                            correct: 0,
                            total: 0,
                            label: q.label || q.id
                        };
                    }
                    questionMap[q.id].total++;
                    if (q.isCorrect === true) questionMap[q.id].correct++;
                });
            });

            questionStats[sub.id] = Object.values(questionMap)
                .filter(q => q.total > 0) // Only include questions with data
                .map(q => {
                    const correctRate = Math.round((q.correct / q.total) * 100);
                    return {
                        id: q.id,
                        label: q.label,
                        correctRate: correctRate,
                        difficulty: correctRate > 80 ? 'Fácil' : correctRate < 40 ? 'Difícil' : 'Moderada',
                        discrimination: 'N/A'
                    };
                })
                .sort((a, b) => a.correctRate - b.correctRate);
        });

        return { total, avg, max, distribution, subjectAverages, questionStats };
    }, [db]);

    if (!stats) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-500 animate-pulse font-mono">INICIALIZANDO SISTEMA NUCLEUS...</div>;

    const variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">
            {/* --- TOP BAR --- */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Brain size={18} className="text-white" />
                        </div>
                        <h1 className="text-lg md:text-xl font-black tracking-tight text-white hidden md:block">
                            NUCLEUS <span className="text-indigo-500 font-mono text-xs opacity-80">ADMIN v3.0</span>
                        </h1>
                    </div>

                    <nav className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[60vw] md:max-w-none no-scrollbar">
                        <NavTab id="overview" label="Dashboard" icon={LayoutDashboard} active={activeTab} set={setActiveTab} />
                        <NavTab id="questions" label="Banco Preguntas" icon={FileQuestion} active={activeTab} set={setActiveTab} />
                        <NavTab id="resources" label="Sala Medios" icon={Video} active={activeTab} set={setActiveTab} />
                        <NavTab id="settings" label="Config" icon={Settings} active={activeTab} set={setActiveTab} />
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center font-bold text-xs text-white">
                            AD
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto p-4">
                <AnimatePresence mode='wait'>
                    {/* --- TAB: OVERVIEW --- */}
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial="hidden" animate="visible" variants={variants} className="space-y-4">
                            {/* KPI ROW */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KPICard label="Estudiantes" value={stats.total} icon={Users} color="blue" />
                                <KPICard label="Promedio" value={stats.avg} icon={Activity} color="indigo" subValue="Pts" />
                                <KPICard label="Récord" value={stats.max} icon={Trophy} color="amber" subValue="Pts" />
                                <KPICard label="Tendencia" value="+12%" icon={TrendingUp} color="emerald" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Control Tower List */}
                                <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col h-[500px] shadow-xl">
                                    <div className="p-3 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 bg-slate-900/80">
                                        <div className="relative w-full md:w-64">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text" placeholder="Buscar alumno..."
                                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                                            {SCORE_RANGES.map(r => (
                                                <button key={r.key} onClick={() => setActiveFilter(r.key === activeFilter ? 'all' : r.key)} className={`px-2 py-1 rounded text-[9px] uppercase font-bold border transition-all ${activeFilter === r.key ? 'bg-slate-800 text-white border-white/50' : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-600'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1`} style={{ backgroundColor: r.color }}></span> {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <StudentList db={db} filter={{ term: searchTerm, range: activeFilter }} onSelect={setSelectedStudent} ranges={SCORE_RANGES} />
                                </div>

                                {/* Right Charts */}
                                <div className="flex flex-col gap-4">
                                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex-1 shadow-lg">
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <Activity size={14} className="text-cyan-400" /> Distribución
                                        </h3>
                                        <div className="h-40">
                                            <ResponsiveContainer>
                                                <BarChart data={stats.distribution} layout="vertical" margin={{ left: 0 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={70} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                                                    <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                                                        {stats.distribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex-1 shadow-lg">
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                                            <Target size={14} className="text-fuchsia-400" /> Rendimiento Área
                                        </h3>
                                        <div className="h-40">
                                            <ResponsiveContainer>
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.subjectAverages}>
                                                    <PolarGrid stroke="#334155" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar name="Promedio" dataKey="avg" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.4} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB: QUESTIONS --- */}
                    {activeTab === 'questions' && (
                        <motion.div key="questions" initial="hidden" animate="visible" variants={variants} className="space-y-6">
                            <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black text-white mb-2">Banco de Preguntas</h2>
                                    <p className="text-slate-400 max-w-2xl">Analiza el comportamiento psicométrico de cada ítem.</p>
                                </div>
                                <FileQuestion className="absolute right-[-20px] bottom-[-20px] text-slate-800 opacity-50" size={150} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {SUBJECTS.map(subject => {
                                    const questions = stats.questionStats[subject.id] || [];
                                    const avgCorrect = questions.length > 0 ? Math.round(questions.reduce((a, b) => a + b.correctRate, 0) / questions.length) : 0;

                                    return (
                                        <div key={subject.id} className="bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col h-[400px]">
                                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                                                <div>
                                                    <h3 className="font-bold text-white flex items-center gap-2">
                                                        <span className="text-lg">{subject.icon}</span> {subject.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                                                        <span>{questions.length} PREGUNTAS</span>
                                                        <span>•</span>
                                                        <span className={avgCorrect > 70 ? 'text-emerald-500' : 'text-amber-500'}>AVG ACIERTO: {avgCorrect}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-slate-950/80 text-[10px] font-bold text-slate-500 uppercase sticky top-0 backdrop-blur-sm z-10">
                                                        <tr>
                                                            <th className="p-3 pl-4">ID</th>
                                                            <th className="p-3">Rendimiento</th>
                                                            <th className="p-3 text-right pr-4">Nivel</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800/30">
                                                        {questions.map((q, i) => (
                                                            <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                                                                <td className="p-3 pl-4 text-xs font-mono text-slate-300">{q.label}</td>
                                                                <td className="p-3">
                                                                    <div className="flex items-center gap-2 w-full max-w-[120px]">
                                                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={`h-full rounded-full ${q.difficulty === 'Difícil' ? 'bg-red-500' : q.difficulty === 'Fácil' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                                                style={{ width: `${q.correctRate}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-[10px] font-bold text-slate-400 w-6 text-right">{q.correctRate}%</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-3 pr-4 text-right">
                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${q.difficulty === 'Difícil' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                        q.difficulty === 'Fácil' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                                        }`}>
                                                                        {q.difficulty}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {questions.length === 0 && (
                                                            <tr><td colSpan={3} className="p-10 text-center text-slate-600 text-xs">No hay datos de preguntas disponibles</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB: RESOURCES --- */}
                    {activeTab === 'resources' && (
                        <motion.div key="resources" initial="hidden" animate="visible" variants={variants} className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Sala de Medios</h2>
                                    <p className="text-slate-400">Archivos y grabaciones de retroalimentación.</p>
                                </div>
                                <button onClick={handleAddRecording} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/20 transition-all">
                                    <Plus size={18} /> Subir Recurso
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recordings.map((rec, i) => (
                                    <div key={rec.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/40 transition-all group cursor-pointer">
                                        <div className="aspect-video bg-slate-950 rounded-xl mb-4 relative flex items-center justify-center overflow-hidden border border-slate-800">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                                            <PlayCircle size={40} className="text-white relative z-20 opacity-80 group-hover:scale-110 group-hover:text-indigo-400 transition-all" />
                                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[9px] font-bold rounded z-20 border border-white/10">{rec.duration}</span>
                                        </div>
                                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">{rec.title}</h3>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-[10px] text-slate-500 font-medium bg-slate-800/50 px-2 py-1 rounded">{rec.date}</span>
                                            <div className="flex gap-1">
                                                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400"><Share2 size={14} /></button>
                                                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400"><MoreVertical size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={handleAddRecording} className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-600 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-slate-900/30 transition-all cursor-pointer min-h-[200px]">
                                    <Video size={32} className="mb-2 opacity-50" />
                                    <p className="font-bold text-xs">Añadir Nuevo Video</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- TAB: SETTINGS --- */}
                    {activeTab === 'settings' && (
                        <motion.div key="settings" initial="hidden" animate="visible" variants={variants} className="max-w-4xl space-y-6">
                            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5"><Settings size={200} /></div>
                                <h2 className="text-2xl font-black text-white mb-6 relative z-10">Configuración del Sistema</h2>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Motor NUCLEUS v10</h4>
                                            <p className="text-xs text-slate-400 max-w-md">Algoritmo de calificación con curva de penalización severa (86-0) y interpolación lineal.</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">ACTIVO</span>
                                    </div>

                                    <div className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
                                        <div>
                                            <h4 className="font-bold text-white mb-1">Boost de Consistencia</h4>
                                            <p className="text-xs text-slate-400">Bonificación automática (+5 pts) por rachas superiores a 5 preguntas correctas.</p>
                                        </div>
                                        <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" /></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <button onClick={saveSettings} className="py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                            <Save size={16} /> Guardar Configuración
                                        </button>
                                        <button className="py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <Download size={16} /> Backup Base de Datos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* --- STUDENT IMPERSONATION MODE (SPY MODE) --- */}
            {/* --- STUDENT IMPERSONATION MODE (SPY MODE) --- */}
            <AnimatePresence>
                {selectedStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[200] bg-[#050914] overflow-hidden flex flex-col"
                    >
                        {/* Admin Control Bar */}
                        <div className="h-14 bg-red-600 shadow-lg shadow-red-900/50 flex items-center justify-between px-6 z-[110] flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <View size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">Modo Supervisión</h3>
                                    <p className="text-center text-[10px] font-bold text-red-200">Viendo como: {selectedStudent.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                            >
                                <LogOut size={16} /> Salir al Admin
                            </button>
                        </div>

                        {/* Render Full Student Dashboard */}
                        <div className="flex-1 overflow-y-auto relative bg-[#0B1121]">
                            <StudentDashboard
                                user={{ ...selectedStudent, role: 'student' }}
                                db={db}
                                setView={(view) => console.log("Navegación simulada a:", view)}
                                onShowQuestionModal={setSelectedQuestionStats}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[200]"
                    >
                        <CheckCircle2 size={24} />
                        <div>
                            <h4 className="font-bold">¡Cambios Guardados!</h4>
                            <p className="text-xs text-emerald-100">La configuración del sistema ha sido actualizada.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question Stats Modal */}
            <QuestionStatsModal
                stats={selectedQuestionStats}
                onClose={() => setSelectedQuestionStats(null)}
            />
        </div>
    );
}

// --- SUBCOMPONENTES ---

function NavTab({ id, label, icon: Icon, active, set }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => set(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${isActive
                ? 'bg-slate-800 text-white shadow-md border-b-2 border-indigo-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                }`}
        >
            <Icon size={14} className={isActive ? 'text-indigo-400' : ''} />
            <span>{label}</span>
        </button>
    );
}

const KPICard = ({ label, value, subValue, icon: Icon, color }) => {
    const colorMap = {
        indigo: 'text-indigo-400 bg-indigo-500/5 border-indigo-500/20',
        blue: 'text-blue-400 bg-blue-500/5 border-blue-500/20',
        amber: 'text-amber-400 bg-amber-500/5 border-amber-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20',
        red: 'text-red-400 bg-red-500/5 border-red-500/20',
    };

    return (
        <div className={`p-4 rounded-2xl border ${colorMap[color]} backdrop-blur-sm shadow-lg`}>
            <div className="flex justify-between items-start mb-2">
                <span className="p-1.5 rounded-md bg-white/5"><Icon size={16} /></span>
                {subValue && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 opacity-80">{subValue}</span>}
            </div>
            <p className="text-[10px] font-bold uppercase opacity-60 mb-0.5">{label}</p>
            <p className="text-2xl font-black tracking-tight leading-none text-white">{value}</p>
        </div>
    );
};

function StudentList({ db, filter, onSelect, ranges }) {
    if (!db?.students) return null;

    // Filtrado avanzado
    const list = db.students.filter(s => {
        const term = (filter.term || '').toLowerCase();
        const studentName = (s.name || 'Sin Nombre').toString().toLowerCase();
        const studentId = (s.id || '').toString();

        const matchesTerm = studentName.includes(term) || studentId.includes(term);
        if (!matchesTerm) return false;

        if (filter.range !== 'all') {
            const range = ranges.find(r => r.key === filter.range);
            if (range && (s.global_score < range.min || s.global_score > range.max)) return false;
        }
        return true;
    }).sort((a, b) => (b.global_score || 0) - (a.global_score || 0));

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950/80 text-[10px] font-black text-slate-500 uppercase sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                        <th className="p-3 pl-4 rounded-l-lg">Agente</th>
                        <th className="p-3 hidden md:table-cell">ID</th>
                        <th className="p-3 text-center">Score</th>
                        <th className="p-3 text-right pr-4 rounded-r-lg">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                    {list.map(s => {
                        const score = s.global_score || 0;
                        const range = ranges.find(r => score >= r.min && score <= r.max) || { color: '#64748b' };
                        return (
                            <tr key={s.id} onClick={() => onSelect(s)} className="group hover:bg-slate-800/40 transition-colors cursor-pointer text-xs md:text-sm">
                                <td className="p-3 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700 group-hover:border-indigo-500 group-hover:text-white transition-colors">
                                            {(s.name || '?').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-300 group-hover:text-white truncate max-w-[120px] md:max-w-none">{s.name || 'Sin Nombre'}</span>
                                    </div>
                                </td>
                                <td className="p-3 hidden md:table-cell font-mono text-slate-500 text-[10px]">{s.id}</td>
                                <td className="p-3 text-center">
                                    <span className="font-black text-base" style={{ color: range.color }}>{score}</span>
                                </td>
                                <td className="p-3 pr-4 text-right">
                                    <span className="text-[9px] font-bold px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-all">
                                        VER
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
