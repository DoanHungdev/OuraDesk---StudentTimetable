import pkg from 'file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js';
const { chromium } = pkg;

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message, err.stack));

  await page.goto('http://127.0.0.1:8088/');
  await page.evaluate(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'peach');

    // User's exact user object
    const user = {
      id: 'usr_univ_demo',
      name: 'Nguyễn Doãn Tuấn Hưng',
      studentId: '2025601062',
      university: 'Đại học Công nghiệp Hà Nội',
      universityId: 'haui',
      schoolShort: 'HaUI',
      campus: 'Cơ sở 1, 2 - Hà Nội',
      campusId: 'haui_hn',
      major: 'Kỹ thuật Cơ điện tử',
      majorId: 'haui_mechatronics',
      cohort: '20',
      faculty: 'Khoa Cơ khí',
      avatar: 'TH',
      mode: 'university'
    };
    localStorage.setItem('class_schedule_univ_user_v2', JSON.stringify(user));

    // User's exact course
    const courses = [
      {
        id: 'crs-auto-ctrl',
        name: 'Introduction to Automatic Control Systems',
        code: 'AUT201',
        credits: 3,
        totalHours: 45,
        hoursPerWeek: 2,
        type: 'theory',
        teacher: 'TS. Hoàng Văn Nam',
        room: '103_A12-QT (Cơ sở 1 - Khu A)',
        color: '#AFC8F5',
        schedules: [
          {
            id: 'sch-auto-1',
            day: 4, // Thursday
            startPeriod: 7,
            endPeriod: 8,
            startTime: '12:30',
            endTime: '14:10',
            sessions: 2,
            room: '103_A12-QT (Cơ sở 1 - Khu A)',
            teacher: 'TS. Hoàng Văn Nam',
            type: 'theory'
          }
        ]
      }
    ];
    localStorage.setItem('class_schedule_univ_courses_v2', JSON.stringify(courses));
  });

  await page.reload();
  await page.waitForTimeout(1000);

  // Click on timetable view
  console.log('Navigating to timetable view...');
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(1000);

  const timetableContent = await page.evaluate(() => {
    const vs = document.getElementById('view-slot');
    return {
      innerHTML: vs?.innerHTML || '',
      gridExists: !!vs?.querySelector('.timetable-grid-container'),
      dayColumns: vs?.querySelectorAll('.day-column')?.length || 0,
      cards: vs?.querySelectorAll('.course-card-block')?.length || 0
    };
  });
  console.log('Timetable Content:', timetableContent);

  await page.screenshot({ path: 'd:\\Project\\Vibe - Coding\\StudentTimetable\\user_test_result.png' });
  await browser.close();
})();
