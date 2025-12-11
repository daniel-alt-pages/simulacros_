// Quick test to verify the fix
import { processRealData } from './src/services/dataService.js';

console.log('🧪 Testing data processing...');
const data = processRealData();

console.log('\n📊 Total students:', data.students.length);

// Check first student's areas
if (data.students.length > 0) {
    const firstStudent = data.students[0];
    console.log('\n👤 First student:', firstStudent.name);
    console.log('Areas:', Object.keys(firstStudent.areas));

    // Check question details for each area
    Object.entries(firstStudent.areas).forEach(([areaName, areaData]) => {
        const correctCount = areaData.question_details?.filter(q => q.isCorrect).length || 0;
        const totalCount = areaData.question_details?.length || 0;
        console.log(`\n  ${areaName}:`);
        console.log(`    Questions: ${totalCount}`);
        console.log(`    Correct: ${correctCount}`);
        console.log(`    Score: ${areaData.score}`);

        // Show first 3 questions
        if (areaData.question_details && areaData.question_details.length > 0) {
            console.log(`    First 3 questions:`);
            areaData.question_details.slice(0, 3).forEach(q => {
                console.log(`      ${q.id}: ${q.isCorrect ? '✅' : '❌'}`);
            });
        }
    });
}
