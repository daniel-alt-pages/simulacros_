
import React, { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import LoginView from './components/views/LoginView';
import StudentDashboard from './components/views/StudentDashboard';
import StudyPlanner from './components/views/StudyPlanner';
import AdminDashboard from './components/views/AdminDashboard';
import StrategicDiagnostic from './components/insights/StrategicDiagnostic';
import PersonalizedStudyPlan from './components/insights/PersonalizedStudyPlan';
import { ArrowRight, Check, ArrowUpCircle, ChevronRight, Calculator, BookOpen, Users, FlaskConical, Languages, X } from 'lucide-react';
import { processRealData } from './services/dataService';

// Valid views for navigation validation
const VALID_VIEWS = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  REPORT: 'report',
  ADMIN: 'admin',
  PLANNER: 'planner'
};

// Reusing config for Report view which is still inline for now or can be moved later
const AREA_CONFIG = {
  "matematicas": {
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    icon: Calculator,
    gradient: "from-red-500 via-rose-500 to-pink-600",
    scoreColor: "text-red-300",
    nameColor: "text-red-100"
  },
  "lectura critica": {
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    icon: BookOpen,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    scoreColor: "text-cyan-300",
    nameColor: "text-cyan-100"
  },
  "sociales y ciudadanas": {
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    icon: Users,
    gradient: "from-amber-500 via-orange-500 to-yellow-600",
    scoreColor: "text-amber-300",
    nameColor: "text-amber-100"
  },
  "ciencias naturales": {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    icon: FlaskConical,
    gradient: "from-emerald-500 via-green-500 to-teal-600",
    scoreColor: "text-emerald-300",
    nameColor: "text-emerald-100"
  },
  "ingles": {
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    icon: Languages,
    gradient: "from-purple-500 via-violet-500 to-fuchsia-600",
    scoreColor: "text-purple-300",
    nameColor: "text-purple-100"
  }
};

// Helper function to generate insights for question analysis
function generateInsight(globalStats) {
  const rate = globalStats.correct_rate || 0;
  if (rate < 30) {
    return "Esta pregunta representa un desafío significativo para la mayoría de estudiantes. Dominarla te dará una ventaja competitiva importante.";
  } else if (rate < 70) {
    return "Pregunta de dificultad moderada que requiere comprensión sólida del concepto.";
  } else {
    return "Esta es una pregunta fundamental que la mayoría domina. Asegúrate de no cometer errores en este tipo de preguntas.";
  }
}

export default function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState('');
  const [selectedQuestionStats, setSelectedQuestionStats] = useState(null); // Modal interaction state

  // --- SECURITY: Hashed Credentials & Data Obfuscation ---
  const ADMIN_HASH = "c827788d91e857a49448610e48cea2af58ad92d4eda9a8f06193e8763e48db16"; // SHA-256 of 1045671402

  const simpleEncrypt = (text) => {
    return btoa(text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (i % 5))).join(''));
  };

  /* eslint-disable no-unused-vars */
  const simpleDecrypt = (encoded) => {
    try {
      return atob(encoded).split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (i % 5))).join('');
    } catch (e) { return null; }
  };
  /* eslint-enable no-unused-vars */

  // Lazy Initialization for Auth State
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('nucleus_user_react');
      const storedRole = localStorage.getItem('nucleus_role');

      const role = storedRole ? simpleDecrypt(storedRole) : null;
      let userData = null;

      if (storedUser) {
        const decryptedUser = simpleDecrypt(storedUser);
        if (decryptedUser) userData = JSON.parse(decryptedUser);
      }

      if (userData && role === 'student') return userData;
      if (role === 'admin') return { name: 'Administrador Maestro', role: 'admin' };
      return null;
    } catch { return null; }
  });

  const [view, setView] = useState(() => {
    const role = localStorage.getItem('nucleus_role');
    // const isValidView = Object.values(VALID_VIEWS).includes(role === 'admin' ? 'admin' : 'dashboard');
    return (role === 'student' || role === 'admin') ? (role === 'admin' ? 'admin' : 'dashboard') : 'login';
  });

  // Load Real JSON Data on Mount
  useEffect(() => {
    processRealData()
      .then(realData => {
        console.log('✅ Data loaded in App:', realData);
        setDb(realData);

        // SYNC USER WITH FRESH DATA
        setUser(currentUser => {
          if (!currentUser || currentUser.role !== 'student') return currentUser;
          const freshStudent = realData.students.find(s => s.id === currentUser.id);
          if (freshStudent) {
            console.log('🔄 Usuario actualizado con datos frescos de DB');
            const updatedUser = { ...freshStudent, role: 'student' };
            // Actualizar localStorage para la próxima vez
            localStorage.setItem('nucleus_user_react', simpleEncrypt(JSON.stringify(freshStudent)));
            return updatedUser;
          }
          return currentUser;
        });
      })
      .catch(err => {
        console.error("❌ Error loading data:", err);
        setError("Error cargando los datos del sistema. Por favor recarga la página.");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nucleus_user_react');
    localStorage.removeItem('nucleus_role');
    setUser(null);
    setView('login');
  };

  // FORCE LOGOUT IF STATE IS INVALID (Fix for empty screen on migration)
  useEffect(() => {
    if (!user && view !== 'login') {
      console.warn("⚠️ Detectado estado inconsistente (Vista sin Usuario). Forzando cierre de sesión...");
      // Wrap in timeout to avoid synchronous state update in effect warning
      setTimeout(() => {
        handleLogout();
      }, 0);
    }
  }, [user, view]);

  const handleLogin = async (docInput) => {
    if (!db) return;

    // Verify Admin via Hash
    const encoder = new TextEncoder();
    const data = encoder.encode(docInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === ADMIN_HASH) {
      const adminUser = { name: 'Administrador Maestro', role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('nucleus_role', simpleEncrypt('admin'));
      setView('admin');
      return;
    }

    const student = db.students.find(s => s.id === docInput);
    if (student) {
      setUser({ ...student, role: 'student' });
      // Obfuscate Storage
      localStorage.setItem('nucleus_user_react', simpleEncrypt(JSON.stringify(student)));
      localStorage.setItem('nucleus_role', simpleEncrypt('student'));
      setView('dashboard');
      setError('');
    } else {
      setError('Documento no encontrado.');
    }
  };

  // --- SECURITY: Lockdown & "God Mode" Unlock (Alt + S + G) ---
  const [devToolsUnlocked, setDevToolsUnlocked] = useState(false);

  useEffect(() => {
    // If Admin or explicitly unlocked via secret combo, allow everything
    if (view === 'admin' || devToolsUnlocked) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleKeyDown = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Use document with capture check to intervene early (window sometimes misses)
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [view, devToolsUnlocked]);

  // Secret Combo Listener: Alt + S + G
  useEffect(() => {
    let keys = { s: false, g: false, Alt: false };

    const handleDown = (e) => {
      if (e.key.toLowerCase() === 's') keys.s = true;
      if (e.key.toLowerCase() === 'g') keys.g = true;
      if (e.key === 'Alt') keys.Alt = true;

      if (keys.Alt && keys.s && keys.g) {
        setDevToolsUnlocked(prev => !prev);
        // alert("🛡️ Security State Toggled"); // Removed alert per user preference for stealth
        keys = { s: false, g: false, Alt: false }; // reset
      }
    };

    const handleUp = (e) => {
      if (e.key.toLowerCase() === 's') keys.s = false;
      if (e.key.toLowerCase() === 'g') keys.g = false;
      if (e.key === 'Alt') keys.Alt = false;
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);



  // Safe navigation handler to prevent empty screens
  const handleViewChange = (newView) => {
    const validViews = Object.values(VALID_VIEWS);

    if (!validViews.includes(newView)) {
      console.error(`⚠️ Vista inválida: "${newView}"`);
      return;
    }

    // Validate user role permissions
    if (user) {
      if (user.role === 'student' && newView === 'admin') {
        console.error('⚠️ Estudiante intentando acceder a vista de admin');
        return;
      }
      if (user.role === 'admin' && (newView === 'dashboard' || newView === 'report')) {
        console.error('⚠️ Admin intentando acceder a vista de estudiante');
        return;
      }
    }
    setView(newView);
  };

  // Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default collapsed for cleaner look

  // ... (handleLogin, handleLogout, handleViewChange remain same)

  if (!db && view !== 'login') return (
    // ... (loading state remains same - condensed for brevity in replacement)
    <div className="h-screen flex items-center justify-center bg-[#0B1121] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B1121] to-black"></div>
      {/* ... loading content ... */}
      <div className="text-center relative z-10">
        <p className="text-indigo-200 font-medium text-lg tracking-widest uppercase animate-pulse">Iniciando Nucleus Engine...</p>
      </div>
    </div>
  );

  return (
    <div
      onContextMenu={(e) => {
        if (view !== 'admin' && !devToolsUnlocked) {
          e.preventDefault();
          return false;
        }
      }}
      className="min-h-screen font-sans bg-[#0B1121] text-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B1121] to-black overflow-x-hidden"
    >

      {view === 'login' && (
        <LoginView onLogin={handleLogin} error={error} />
      )}

      {view !== 'login' && user && (
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar
            user={user}
            view={view}
            setView={handleViewChange}
            handleLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <main className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-10 overflow-y-auto relative z-10 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
            {/* Background Glow effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]"></div>
            </div>

            {user.role === 'student' && view === 'dashboard' && (
              <StudentDashboard
                user={user}
                db={db}
                setView={handleViewChange}
                onShowQuestionModal={setSelectedQuestionStats}
              />
            )}

            {user.role === 'student' && view === 'planner' && (
              <div className="animate-slide-up">
                <button onClick={() => handleViewChange('dashboard')} className="group flex items-center text-slate-400 hover:text-indigo-400 transition-colors font-bold mb-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 px-6 py-3 rounded-xl backdrop-blur-md">
                  <ArrowRight className="rotate-180 mr-2" size={20} />
                  Volver al Dashboard
                </button>
                <StudyPlanner user={user} />
              </div>
            )}

            {user.role === 'student' && view === 'report' && (
              <div className="max-w-6xl mx-auto animate-slide-up">
                <button onClick={() => handleViewChange('dashboard')} className="group flex items-center text-slate-400 hover:text-cyan-400 transition-colors font-bold mb-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 px-6 py-3 rounded-xl backdrop-blur-md">
                  <ArrowRight className="rotate-180 mr-2" size={20} />
                  Volver al Dashboard
                </button>

                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-10 mb-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                      <span className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-bold tracking-wider mb-4">INFORME OFICIAL</span>
                      <h1 className="text-4xl md:text-6xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{db?.metadata?.test_name || 'NUCLEUS Analytics'}</h1>
                      <p className="text-slate-400 font-semibold text-lg">Generado por Nucleus Engine v3.0</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-xl text-white p-8 rounded-2xl text-center min-w-[200px] shadow-2xl border border-slate-700 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl"></div>
                      <span className="relative z-10 text-6xl font-black tracking-tighter text-indigo-400">{user.global_score || 0}</span>
                      <span className="relative z-10 block text-sm text-slate-400 font-bold uppercase mt-2">Puntaje Global</span>
                    </div>
                  </div>
                </div>

                {/* Strategic Diagnostic Section */}
                <StrategicDiagnostic user={user} db={db} />

                {/* Personalized Study Plan */}
                <PersonalizedStudyPlan user={user} />

                <div className="space-y-8">
                  {user.areas && Object.entries(user.areas).map(([areaName, data]) => {
                    // Defensive validation
                    if (!data || typeof data !== 'object') {
                      console.warn(`⚠️ Invalid data for area: ${areaName}`);
                      return null;
                    }

                    const config = AREA_CONFIG[areaName] || AREA_CONFIG["matematicas"];
                    const Icon = config.icon;

                    // Ensure evidence and recommended_plan exist
                    const evidences = data.evidences || data.evidence || [];
                    const recommendedPlan = data.recommended_plan || [];

                    return (
                      <div key={areaName} className="bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-800 overflow-hidden hover:shadow-2xl hover:border-slate-600 transition-all group">
                        <div className={`bg-gradient-to-r ${config.gradient} p-[1px] relative`}>
                          <div className="absolute inset-0 bg-white/20"></div>
                          <div className="bg-slate-900 p-6 text-white relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 bg-${config.color.split('-')[1]}-500/10 rounded-xl border border-${config.color.split('-')[1]}-500/20`}>
                                  <Icon size={28} className={config.color} />
                                </div>
                                <div>
                                  <h4 className="text-2xl font-black capitalize text-slate-100">{areaName}</h4>
                                  <p className={`font-semibold ${config.color}`}>{data.level_title || `Nivel ${data.level || 1}`}</p>
                                </div>
                              </div>
                              <div className="text-5xl font-black text-white drop-shadow-lg">{data.score || 0}</div>
                              <div className="text-sm font-bold text-white/60 tracking-wider">PUNTAJE</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <h5 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Check size={16} className="text-emerald-500" /> Fortalezas Demostradas
                              </h5>
                              {evidences.length > 0 ? (
                                <ul className="space-y-3">
                                  {evidences.map((e, i) => (
                                    <li key={i} className="flex items-start text-slate-300 font-medium">
                                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> {e}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-400 text-sm">Continúa practicando para desarrollar tus fortalezas.</p>
                              )}
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                              <h5 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ArrowUpCircle size={16} className="text-indigo-500" /> Plan de Mejora
                              </h5>
                              {recommendedPlan.length > 0 ? (
                                <ul className="space-y-3">
                                  {recommendedPlan.map((p, i) => (
                                    <li key={i} className="flex items-start text-slate-300 font-semibold">
                                      <ChevronRight className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                                      {p}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-400 text-sm">Sigue fortaleciendo tus conocimientos en esta área.</p>
                              )}
                            </div>
                          </div>

                          {/* Desglose de Preguntas (Question Matrix) */}
                          {data.question_details && data.question_details.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-700/50">
                              <h5 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <BookOpen size={16} className={config.color} /> Desglose de Respuestas
                              </h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {data.question_details.map((q) => {
                                  // Get global stats for this question from admin_analytics
                                  // admin_analytics structure: { "matematicas": { "P1": {...}, "P2": {...} } }
                                  const areaStats = db?.admin_analytics?.[areaName] || {};
                                  const globalStat = areaStats[q.id] || null;
                                  const successRate = globalStat ? globalStat.correct_rate : 0;

                                  return (
                                    <div
                                      key={q.id}
                                      onClick={() => {
                                        setSelectedQuestionStats({
                                          ...q,
                                          label: q.id,
                                          areaName,
                                          answer: q.correctAnswer || globalStat?.correct_answer || 'A',
                                          global: globalStat || { correct_rate: 0, total_attempts: 0, distractors: {} },
                                          userStatus: q.isCorrect ? 'correct' : 'incorrect',
                                          userSelected: q.value || 'N/A'
                                        });
                                      }}
                                      className={`relative group p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24 hover:scale-[1.03] hover:shadow-lg ${q.isCorrect
                                        ? 'bg-slate-900/40 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
                                        : 'bg-slate-900/40 border-slate-700 hover:border-red-500/50 hover:bg-slate-800'
                                        }`}
                                    >
                                      <div className="flex justify-between items-start w-full mb-1">
                                        <span className="text-xs font-bold text-slate-400">{q.id}</span>
                                        <div className={`w-2 h-2 rounded-full ${q.isCorrect ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></div>
                                      </div>

                                      <div className="flex items-end justify-between w-full">
                                        <div className="flex flex-col">
                                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Global</span>
                                          <div className="flex items-center gap-1">
                                            <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full rounded-full ${successRate > 70 ? 'bg-emerald-400' : successRate < 40 ? 'bg-red-400' : 'bg-amber-400'}`}
                                                style={{ width: `${successRate}%` }}
                                              ></div>
                                            </div>
                                            <span className={`text-[10px] font-bold ${successRate > 70 ? 'text-emerald-400' : successRate < 40 ? 'text-red-400' : 'text-amber-400'}`}>
                                              {successRate}%
                                            </span>
                                          </div>
                                        </div>

                                        {q.status === 'incorrect' && (
                                          <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-slate-500">Marcaste</span>
                                            <span className="text-sm font-black text-red-400 font-mono">{q.selected}</span>
                                          </div>
                                        )}
                                        {q.status === 'correct' && (
                                          <Check size={16} className="text-emerald-500/50" />
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {user.role === 'admin' && (
              <AdminDashboard db={db} />
            )}

            {/* Question Stats Modal - PREMIUM REDESIGN */}
            {selectedQuestionStats && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
                onClick={() => setSelectedQuestionStats(null)}>
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden relative animate-slide-up" onClick={e => e.stopPropagation()}>

                  {/* Decorative gradient orbs */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                  {/* Header */}
                  <div className="relative p-6 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                            <BrainCircuit size={20} className="text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white">{selectedQuestionStats.label}</h3>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{selectedQuestionStats.areaName}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedQuestionStats(null)}
                        className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="relative p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* 1. Your Result vs Difficulty - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Your Answer */}
                      <div className={`relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center overflow-hidden group transition-all duration-300 ${selectedQuestionStats.userStatus === 'correct'
                        ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/60 hover:bg-emerald-500/15'
                        : 'bg-red-500/10 border-red-500/40 hover:border-red-500/60 hover:bg-red-500/15'
                        }`}>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${selectedQuestionStats.userStatus === 'correct' ? 'bg-emerald-500/5' : 'bg-red-500/5'
                          }`}></div>
                        <span className="relative text-xs font-black uppercase tracking-wider mb-3 text-slate-300">Tu Respuesta</span>
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-2 transition-transform group-hover:scale-110 duration-300 ${selectedQuestionStats.userStatus === 'correct'
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40'
                          : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40'
                          }`}>
                          {selectedQuestionStats.userStatus === 'correct' ? <Check size={32} /> : selectedQuestionStats.userSelected}
                        </div>
                        <span className={`relative text-base font-bold ${selectedQuestionStats.userStatus === 'correct' ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                          {selectedQuestionStats.userStatus === 'correct' ? 'Correcta' : 'Incorrecta'}
                        </span>
                      </div>

                      {/* Difficulty Gauge */}
                      <div className="relative p-6 rounded-2xl border-2 border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50 flex flex-col items-center justify-center text-center transition-all duration-300 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative text-xs font-black uppercase tracking-wider mb-3 text-slate-300">Dificultad Global</span>
                        <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              stroke={selectedQuestionStats.global.correct_rate < 30 ? '#ef4444' : selectedQuestionStats.global.correct_rate < 70 ? '#f59e0b' : '#10b981'}
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={213.628}
                              strokeDashoffset={213.628 - (213.628 * selectedQuestionStats.global.correct_rate) / 100}
                              className="transition-all duration-1000 drop-shadow-[0_0_8px_currentColor]"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xl font-black text-white">{selectedQuestionStats.global.correct_rate}%</span>
                        </div>
                        <span className={`relative text-sm font-bold px-3 py-1 rounded-full ${selectedQuestionStats.global.correct_rate < 30
                          ? 'text-red-400 bg-red-500/20'
                          : selectedQuestionStats.global.correct_rate < 70
                            ? 'text-amber-400 bg-amber-500/20'
                            : 'text-emerald-400 bg-emerald-500/20'
                          }`}>
                          {selectedQuestionStats.global.correct_rate < 30 ? '🔥 Muy Difícil' : selectedQuestionStats.global.correct_rate < 70 ? '⚡ Moderada' : '✨ Fácil'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Detailed Answer Distribution - ALL OPTIONS */}
                    <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                      <h4 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <Users size={18} className="text-cyan-400" />
                        Distribución de Respuestas del Grupo
                      </h4>
                      <div className="space-y-4">
                        {/* Generate bars for ALL options A, B, C, D */}
                        {['A', 'B', 'C', 'D'].map((option) => {
                          const isCorrect = option === selectedQuestionStats.answer;
                          const isUserChoice = option === selectedQuestionStats.userSelected;
                          const count = selectedQuestionStats.global.distractors?.[option] || 0;
                          const totalAttempts = selectedQuestionStats.global.total_attempts || 1;
                          const percentage = Math.round((count / totalAttempts) * 100);

                          return (
                            <div key={option} className={`group transition-all duration-300 ${isUserChoice ? 'scale-105' : ''}`}>
                              <div className="flex justify-between items-center text-sm font-bold mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isCorrect
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : isUserChoice
                                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                      : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    {option}
                                  </span>
                                  <span className={`${isCorrect ? 'text-emerald-400' : isUserChoice ? 'text-red-400' : 'text-slate-400'
                                    }`}>
                                    {isCorrect && '✓ Correcta'}
                                    {!isCorrect && isUserChoice && '✗ Tu elección'}
                                    {!isCorrect && !isUserChoice && 'Distractor'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-slate-300 font-mono">{count} estudiantes</span>
                                  <span className={`font-black text-lg ${isCorrect ? 'text-emerald-400' : isUserChoice ? 'text-red-400' : 'text-slate-400'
                                    }`}>
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="h-3 w-full bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/30">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${isCorrect
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                                    : isUserChoice
                                      ? 'bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                                      : 'bg-gradient-to-r from-slate-600 to-slate-500'
                                    }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Summary Stats */}
                      <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Total de respuestas: <span className="text-white font-bold">{selectedQuestionStats.global.total_attempts}</span></span>
                        <span className="text-slate-400 font-semibold">Tasa de acierto: <span className="text-emerald-400 font-bold">{selectedQuestionStats.global.correct_rate}%</span></span>
                      </div>
                    </div>

                    {/* 3. AI Analysis Insight */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 rounded-2xl border border-indigo-500/30 flex gap-4 hover:border-indigo-500/50 transition-all duration-300 group">
                      <div className="p-3 bg-indigo-500/20 rounded-xl h-fit text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                        <BrainCircuit size={24} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                          Análisis de NUCLEUS
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">AI</span>
                        </h5>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                          {generateInsight(selectedQuestionStats.global)}
                          {selectedQuestionStats.userStatus === 'incorrect' && " 💡 Revisa la justificación teórica en tus apuntes y practica preguntas similares."}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}
    </div>
  );
}
