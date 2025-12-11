// ==========================================
// ⚠️ DEPRECATED - DO NOT USE
// ==========================================
// 
// Este script está DEPRECADO y ya no es necesario.
// 
// RAZÓN: Intentaba arreglar archivos CSV que no existen en las rutas especificadas.
// Los CSVs reales están en public/data/ y se procesan directamente en el navegador.
//
// REEMPLAZO: src/services/csvProcessor.js
//
// Si necesitas procesar CSVs, usa el nuevo sistema:
// import { loadNucleusData } from './src/services/csvProcessor.js';
//
// Este archivo se mantiene solo por referencia histórica.
// Puede ser eliminado de forma segura.
// ==========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('⚠️  ADVERTENCIA: Este script está DEPRECADO');
console.log('📝 Usa src/services/csvProcessor.js en su lugar');
console.log('❌ Este archivo puede ser eliminado de forma segura');

// Código original comentado para referencia
/*
// Archivos a verificar y corregir
const files = [
    '../src/data/raw/matematicas.csv',
    '../src/data/raw/lectura_critica.csv',
    '../src/data/raw/sociales.csv',
    '../src/data/raw/ciencias.csv',
    '../src/data/raw/ingles.csv',
    '../public/NUCLEUS_WEB_DB.json'
];

console.log('🔧 Iniciando corrección de encoding...\n');

files.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);

    try {
        // Leer archivo
        const content = fs.readFileSync(filePath, 'utf8');

        // Verificar si tiene caracteres problemáticos
        const hasIssues = /�|Ã±|Ã³|Ã­|Ã©|Ã¡/.test(content);

        if (hasIssues) {
            console.log(`⚠️  ${path.basename(filePath)} - Detectados problemas de encoding`);

            // Intentar corregir caracteres comunes mal codificados
            let fixed = content
                .replace(/Ã±/g, 'ñ')
                .replace(/Ã³/g, 'ó')
                .replace(/Ã­/g, 'í')
                .replace(/Ã©/g, 'é')
                .replace(/Ã¡/g, 'á')
                .replace(/Ãº/g, 'ú')
                .replace(/Ã"/g, 'Ñ')
                .replace(/Ã"/g, 'Ó')
                .replace(/Ã/g, 'Í')
                .replace(/Ã‰/g, 'É')
                .replace(/Ã/g, 'Á')
                .replace(/Ãš/g, 'Ú');

            // Guardar archivo corregido
            fs.writeFileSync(filePath, fixed, 'utf8');
            console.log(`   ✅ Corregido y guardado\n`);
        } else {
            console.log(`✅ ${path.basename(filePath)} - Encoding correcto\n`);
        }
    } catch (error) {
        console.error(`❌ Error procesando ${path.basename(filePath)}:`, error.message, '\n');
    }
});

console.log('🎉 Proceso completado');
*/
