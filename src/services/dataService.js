
import { loadLocalCSVData } from './localDataProcessor';

/**
 * Service to handle data loading.
 * Previously this might have loaded the JSON DB.
 * Now it triggers the local CSV processing on the fly.
 */
export async function processRealData() {
    try {
        console.log("🔄 dataService: Initiating dynamic CSV processing...");
        const data = await loadLocalCSVData();
        return data;
    } catch (error) {
        console.error("❌ dataService: Error processing local data", error);
        throw error;
    }
}
