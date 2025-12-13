import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

/**
 * ==========================================
 * 🔥 CONFIGURACIÓN DE FIREBASE (SEGURA)
 * ==========================================
 * Las credenciales se cargan desde variables de entorno.
 * NO MODIFICAR ESTE ARCHIVO CON CREDENCIALES REALES.
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase solo si las credenciales existen
let app;
let db;

try {
    if (import.meta.env.VITE_FIREBASE_API_KEY) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("🔥 Firebase inicializado de forma segura");
    } else {
        console.warn("⚠️ Credenciales de Firebase no detectadas en variables de entorno.");
    }
} catch (error) {
    console.error("❌ Error inicializando Firebase.", error);
}

/**
 * Guarda el plan de estudio de un estudiante
 * @param {string} studentId - ID único del estudiante
 * @param {object} planData - Objeto con el plan y configuración
 */
export const saveStudyPlan = async (studentId, planData) => {
    if (!db) return false;
    try {
        await setDoc(doc(db, "study_plans", studentId), {
            ...planData,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (e) {
        console.error("Error guardando plan:", e);
        return false;
    }
};

/**
 * Recupera el plan de estudio guardado
 * @param {string} studentId 
 */
export const getStudyPlan = async (studentId) => {
    if (!db) return null;
    try {
        const docRef = doc(db, "study_plans", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (e) {
        console.error("Error recuperando plan:", e);
        return null;
    }
};

export { db };
