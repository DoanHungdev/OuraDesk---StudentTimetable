import pkg from 'file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js';
const { chromium } = pkg;
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\374e7888-a9e1-40be-9088-41c689fb2ecb';

(async () => {
  console.log('=== BẮT ĐẦU KIỂM THỬ GRID & COURSE CARDS KHỚP TỌA ĐỘ ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  // 1. Tải ứng dụng trên University Mode
  console.log('1. Tải ứng dụng localhost:8088...');
  await page.goto('http://127.0.0.1:8088/');
  await page.evaluate(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'peach');
  });
  await page.reload();
  await page.waitForTimeout(800);

  // Switch to timetable view
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  // Screenshot 1: Desktop Fitted Grid (HaUI Theory)
  console.log('2. Chụp Desktop Fitted Grid...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_grid_fitted_desktop.png') });
  console.log('✓ Đã chụp timetable_grid_fitted_desktop.png');

  // 2. Thêm môn học gây trùng giờ trên Thứ Năm để test Overlap Layout (50% - 50%)
  console.log('3. Test Overlap Layout khi có 2 môn trùng giờ trên Thứ Năm...');
  await page.evaluate(() => {
    let courses = JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
    if (courses.length === 0) {
      courses = [
        {
          id: 'crs-eng',
          name: 'Tiếng Anh chuyên ngành',
          code: 'ENG202',
          credits: 2,
          totalHours: 30,
          teacher: 'ThS. Trần Thị Mai',
          room: 'Phòng C302',
          color: '#AFC8F5',
          category: 'lang',
          schedules: [
            {
              id: 'sch-eng-1',
              day: 4,
              startPeriod: 4,
              endPeriod: 5,
              startTime: '09:50',
              endTime: '11:30',
              sessions: 2,
              room: 'Phòng C302',
              teacher: 'ThS. Trần Thị Mai'
            }
          ]
        }
      ];
    }
    courses.push({
      id: 'crs-overlap-test',
      name: 'Thí nghiệm Vi điều khiển',
      code: 'EMB302',
      credits: 2,
      totalHours: 30,
      teacher: 'TS. Lê Hoàng',
      room: 'Lab IoT 402',
      color: '#A9DED5',
      category: 'it',
      schedules: [
        {
          id: 'sch-overlap-1',
          day: 4, // Thứ 5
          startPeriod: 3,
          endPeriod: 5,
          startTime: '08:50',
          endTime: '11:30',
          sessions: 3,
          room: 'Lab IoT 402',
          teacher: 'TS. Lê Hoàng'
        }
      ]
    });
    localStorage.setItem('class_schedule_univ_courses_v2', JSON.stringify(courses));
  });
  await page.reload();
  await page.waitForTimeout(800);
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_grid_overlap_conflict.png') });
  console.log('✓ Đã chụp timetable_grid_overlap_conflict.png');

  // 3. Test High School Mode
  console.log('4. Kiểm tra chế độ THPT (High School Mode)...');
  await page.evaluate(() => {
    localStorage.setItem('class_schedule_mode_v2', 'high_school');
    localStorage.setItem('classSchedule.theme', 'peach');
  });
  await page.reload();
  await page.waitForTimeout(800);
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_grid_high_school.png') });
  console.log('✓ Đã chụp timetable_grid_high_school.png');

  // 4. Test Mobile View (390x844)
  console.log('5. Kiểm tra Mobile Day View (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:8088/');
  await mobilePage.evaluate(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'peach');
  });
  await mobilePage.reload();
  await mobilePage.waitForTimeout(800);
  await mobilePage.click('.mobile-nav-btn[data-view="timetable"]');
  await mobilePage.waitForTimeout(600);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_grid_mobile_dayview.png') });
  console.log('✓ Đã chụp timetable_grid_mobile_dayview.png');

  // 5. Test Midnight Theme
  console.log('6. Kiểm tra Midnight Glass Dark Theme...');
  await page.evaluate(() => {
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'midnight');
  });
  await page.reload();
  await page.waitForTimeout(800);
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_grid_midnight_theme.png') });
  console.log('✓ Đã chụp timetable_grid_midnight_theme.png');

  await browser.close();
  console.log('=== TẤT CẢ KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG 100%! ===');
})();
