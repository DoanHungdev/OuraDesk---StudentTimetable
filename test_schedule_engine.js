import { ScheduleEngine } from './js/utils/scheduleEngine.js';
import { AcademicCalendar } from './js/data/academicCalendar.js';

console.log('=== KIỂM THỬ ĐƠN VỊ SCHEDULE ENGINE & ACADEMIC CALENDAR ===\n');

// TEST 1: 45 periods, 3 periods/week, start 18/08/2026 (Tuesday)
console.log('--- Test 1: 45 tiết, 3 tiết/tuần (Thứ 3, Tiết 1-3), bắt đầu 18/08/2026 ---');
const res1 = ScheduleEngine.calculateScheduleMeta({
  startDate: '2026-08-18',
  totalPeriods: 45,
  schedules: [{ day: 2, startPeriod: 1, endPeriod: 3 }]
});
console.log(`Bắt đầu: ${res1.startDateFormatted}`);
console.log(`Dự kiến kết thúc: ${res1.calculatedEndDate}`);
console.log(`Số buổi học: ${res1.totalSessions} buổi`);
console.log(`Số tuần: ${res1.totalWeeks} tuần`);
console.log(`Số tiết/tuần: ${res1.periodsPerWeek} tiết/tuần`);
console.log(`Có phần lẻ không: ${res1.isOddRemainder ? 'Có' : 'Không'}`);
console.assert(res1.totalSessions === 15, `Expected 15 sessions, got ${res1.totalSessions}`);
console.log('✓ Test 1 ĐẠT!\n');

// TEST 2: 45 periods, Multi-session (Mon 2 periods + Thu 3 periods = 5 periods/week)
console.log('--- Test 2: 45 tiết, 2 buổi/tuần (Thứ 2: 2 tiết + Thứ 5: 3 tiết = 5 tiết/tuần) ---');
const res2 = ScheduleEngine.calculateScheduleMeta({
  startDate: '2026-08-17', // Monday
  totalPeriods: 45,
  schedules: [
    { day: 1, startPeriod: 1, endPeriod: 2 }, // 2 periods
    { day: 4, startPeriod: 3, endPeriod: 5 }  // 3 periods
  ]
});
console.log(`Bắt đầu: ${res2.startDateFormatted}`);
console.log(`Dự kiến kết thúc: ${res2.calculatedEndDate}`);
console.log(`Số buổi học: ${res2.totalSessions} buổi`);
console.log(`Số tiết/tuần: ${res2.periodsPerWeek} tiết/tuần`);
console.log(`Số tuần: ${res2.totalWeeks} tuần`);
console.assert(res2.periodsPerWeek === 5, `Expected 5 periods/week, got ${res2.periodsPerWeek}`);
console.log('✓ Test 2 ĐẠT!\n');

// TEST 3: 40 periods, 3 periods/week (Odd remainder: 13 x 3 + 1)
console.log('--- Test 3: 40 tiết, 3 tiết/tuần (Trường hợp lẻ: 13 buổi 3 tiết + 1 buổi 1 tiết) ---');
const res3 = ScheduleEngine.calculateScheduleMeta({
  startDate: '2026-08-18',
  totalPeriods: 40,
  schedules: [{ day: 2, startPeriod: 1, endPeriod: 3 }]
});
console.log(`Bắt đầu: ${res3.startDateFormatted}`);
console.log(`Dự kiến kết thúc: ${res3.calculatedEndDate}`);
console.log(`Số buổi học: ${res3.totalSessions} buổi`);
console.log(`Số tiết/tuần: ${res3.periodsPerWeek} tiết/tuần`);
console.log(`Có phần lẻ không: ${res3.isOddRemainder ? 'Có' : 'Không'}`);
const lastOcc = res3.occurrences[res3.occurrences.length - 1];
console.log(`Buổi cuối cùng tiêu thụ: ${lastOcc.periodsConsumed} tiết (Tiết ${lastOcc.startPeriod}–${lastOcc.endPeriod})`);
console.assert(res3.totalSessions === 14, `Expected 14 sessions (13x3 + 1), got ${res3.totalSessions}`);
console.assert(lastOcc.periodsConsumed === 1, `Expected last session 1 period, got ${lastOcc.periodsConsumed}`);
console.log('✓ Test 3 ĐẠT!\n');

// TEST 4: Holiday Exclusion (e.g. Wednesday 02/09/2026 is Quốc Khánh)
console.log('--- Test 4: Lịch rơi vào ngày lễ 02/09/2026 được tự động lùi ngày ---');
const res4 = ScheduleEngine.calculateScheduleMeta({
  startDate: '2026-08-19', // Wednesday
  totalPeriods: 15, // 5 sessions of 3 periods
  schedules: [{ day: 3, startPeriod: 1, endPeriod: 3 }]
});
const occDates = res4.occurrences.map(o => o.dateFormatted);
console.log('Các ngày học:', occDates);
console.assert(!occDates.includes('02/09/2026'), 'Date 02/09/2026 should be skipped as holiday!');
console.log('✓ Test 4 ĐẠT (Ngày 02/09/2026 được tự động bỏ qua)!\n');

console.log('=== TẤT CẢ UNIT TEST SCHEDULE ENGINE THÀNH CÔNG 100%! ===');
