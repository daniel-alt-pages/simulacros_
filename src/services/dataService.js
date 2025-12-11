// ==========================================
// 🚀 NUCLEUS DATA SERVICE - Dynamic CSV Processing
// Processes CSV files directly, no JSON needed
// ==========================================

import { loadNucleusData } from './csvProcessor.js';

/**
 * Load and process data from CSV files
 * This replaces the Python script and JSON generation approach
 */
export function processRealData() {
    console.log('🔄 Loading NUCLEUS data...');

    try {
        return loadNucleusData()
            .then(data => {
                console.log('✅ NUCLEUS data loaded successfully');
                console.log(`📊 Total students: ${data.students?.length || 0}`);

                // Validate data structure
                if (!data.students || !Array.isArray(data.students)) {
                    console.error('❌ Invalid data structure: missing students array');
                    return { students: [], metadata: {}, admin_analytics: {} };
                }

                // Log sample student data
                if (data.students.length > 0) {
                    console.log('📝 Sample student:', data.students[0].name);
                    console.log('📈 Sample score:', data.students[0].global_score);
                }

                return data;
            })
            .catch(error => {
                console.error('❌ Error loading NUCLEUS data:', error);
                // Return empty data structure to prevent crashes
                return {
                    students: [],
                    metadata: {
                        test_name: 'NUCLEUS Analytics',
                        date: new Date().toISOString()
                    },
                    admin_analytics: {}
                };
            });
    } catch (error) {
        console.error('❌ Fatal error in processRealData:', error);
        return Promise.resolve({
            students: [],
            metadata: {},
            admin_analytics: {}
        });
    }
}
