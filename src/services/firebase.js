import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

/**
 * ==========================================
 * 🔥 CONFIGURACIÓN DE FIREBASE
 * ==========================================
 * Sigue la guía en 'FIREBASE_SETUP_GUIDE.md' para obtener estos valores.
 */
const firebaseConfig = {
    apiKey: "AIzaSyCjVydFLBVviDSVYJVwT8V_pzJQl38ZsiY",
    authDomain: "nucleus-analytics-db.firebaseapp.com",
    projectId: "nucleus-analytics-db",
    storageBucket: "nucleus-analytics-db.firebasestorage.app",
    messagingSenderId: "419609486450",
    appId: "1:419609486450:web:dc302796c25d3ede970eeb"
};

// Inicializar Firebase
let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase inicializado correctamente");
} catch (error) {
    console.error("❌ Error inicializando Firebase. Revisa tu configuración.", error);
}

/**
 * Guarda el plan de estudio de un estudiante
 * @param {string} studentId - ID único del estudiante
 * @param {object} planData - Objeto con el plan y configuración
 */
export const saveStudyPlan = async (studentId, planData) => {
    if (!db) return;
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
