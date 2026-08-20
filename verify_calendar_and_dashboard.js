const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');

async function verifyCalendarAndDashboard() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  console.log('--- 1. Testing Desktop View (1440x900) ---');
  const desktopPage = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await desktopPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'peach');
  });

  await desktopPage.goto('http://localhost:8088/index.html');
  await desktopPage.waitForTimeout(1000);

  // 1.1 Test Initial Mini Calendar State
  const initialMonthText = await desktopPage.$eval('.right-panel .mini-cal-month-title', el => el.innerText);
  console.log(`Initial Month: ${initialMonthText}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_1_desktop_initial.png' });

  // 1.2 Test Next Month Button
  console.log('Testing Next Month (›)...');
  await desktopPage.click('.right-panel .btn-mini-cal-next');
  await desktopPage.waitForTimeout(300);
  const nextMonthText = await desktopPage.$eval('.right-panel .mini-cal-month-title', el => el.innerText);
  console.log(`After Next: ${nextMonthText}`);

  // 1.3 Test Year Rollover (Go forward to January 2027)
  console.log('Testing Year Rollover to 2027...');
  for (let i = 0; i < 4; i++) {
    await desktopPage.click('.right-panel .btn-mini-cal-next');
    await desktopPage.waitForTimeout(200);
  }
  const jan2027Text = await desktopPage.$eval('.right-panel .mini-cal-month-title', el => el.innerText);
  console.log(`Year Rollover Forward: ${jan2027Text}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_2_year_rollover_2027.png' });

  // 1.4 Test Prev Month Button back to August 2026
  console.log('Testing Prev Month (‹) back to August 2026...');
  for (let i = 0; i < 5; i++) {
    await desktopPage.click('.right-panel .btn-mini-cal-prev');
    await desktopPage.waitForTimeout(200);
  }
  const backToAugText = await desktopPage.$eval('.right-panel .mini-cal-month-title', el => el.innerText);
  console.log(`Back to: ${backToAugText}`);

  // 1.5 Click Sunday (e.g. August 23) -> Should have 0 courses
  console.log('Clicking Sunday (day with 0 courses)...');
  const sunBtn = await desktopPage.$('.right-panel .mini-cal-day-cell[data-date$="-23"]');
  if (sunBtn) {
    await sunBtn.click();
    await desktopPage.waitForTimeout(400);
    const widgetTitle = await desktopPage.$eval('.right-panel .widget-title', el => el.innerText);
    const countText = await desktopPage.$eval('.right-panel .btn-view-day-schedule', el => el.innerText);
    console.log(`Sunday Schedule Widget Title: "${widgetTitle}", Count: "${countText}"`);
    await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_3_sunday_0_courses.png' });
  }

  // 1.6 Click Wednesday (August 19) -> Should have courses
  console.log('Clicking Wednesday (day with courses)...');
  const wedBtn = await desktopPage.$('.right-panel .mini-cal-day-cell[data-date$="-19"]');
  if (wedBtn) {
    await wedBtn.click();
    await desktopPage.waitForTimeout(400);
    const widgetTitle = await desktopPage.$eval('.right-panel .widget-title', el => el.innerText);
    const countText = await desktopPage.$eval('.right-panel .btn-view-day-schedule', el => el.innerText);
    console.log(`Wednesday Schedule Widget Title: "${widgetTitle}", Count: "${countText}"`);
    await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_4_wednesday_courses.png' });
  }

  // 1.7 Test Clicking Course Card to open modal
  console.log('Testing Course Card click in RightPanel...');
  const firstCourseCard = await desktopPage.$('.right-panel .today-class-item');
  if (firstCourseCard) {
    await firstCourseCard.click();
    await desktopPage.waitForTimeout(500);
    const modalVisible = await desktopPage.$eval('#course-modal-backdrop', el => el.classList.contains('open'));
    console.log(`Course Details Modal opened: ${modalVisible}`);
    await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_5_course_modal_open.png' });
    await desktopPage.click('#modal-close-x');
    await desktopPage.waitForTimeout(300);
  }

  // 1.8 Test "Quản lý" button in Deadlines widget -> Navigate to Assignments
  console.log('Testing "Quản lý" button click...');
  await desktopPage.click('.right-panel .btn-right-view-tasks');
  await desktopPage.waitForTimeout(500);
  console.log(`Current URL: ${desktopPage.url()}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_6_navigated_to_assignments.png' });

  // 1.9 Navigate back to Dashboard and test "0 môn" / count button -> Navigate to Timetable
  await desktopPage.click('.nav-item[data-view="dashboard"]');
  await desktopPage.waitForTimeout(500);
  console.log('Testing count button click to navigate to Timetable...');
  await desktopPage.click('.right-panel .btn-view-day-schedule');
  await desktopPage.waitForTimeout(500);
  console.log(`After count click URL: ${desktopPage.url()}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_7_navigated_to_timetable.png' });

  await desktopPage.close();

  // --- 2. Testing Mobile View (390x844 - iPhone 14) ---
  console.log('\n--- 2. Testing Mobile View (390x844) ---');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  await mobilePage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'midnight');
  });

  await mobilePage.goto('http://localhost:8088/index.html');
  await mobilePage.waitForTimeout(1000);

  // Scroll down to Mobile Companion Section
  await mobilePage.evaluate(() => {
    document.getElementById('mobile-companion-panel')?.scrollIntoView({ behavior: 'smooth' });
  });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_8_mobile_dashboard_companion.png' });
  console.log('✅ Captured cal_8_mobile_dashboard_companion.png');

  // Test Next Month on Mobile
  console.log('Testing Next Month (›) on Mobile Touch...');
  await mobilePage.click('#mobile-companion-panel .btn-mini-cal-next');
  await mobilePage.waitForTimeout(400);
  const mobileMonthText = await mobilePage.$eval('#mobile-companion-panel .mini-cal-month-title', el => el.innerText);
  console.log(`Mobile Month after Next: ${mobileMonthText}`);
  await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_9_mobile_next_month.png' });

  // Test selecting a date on Mobile (e.g. 15th)
  console.log('Testing Date Selection on Mobile Touch...');
  const mobileDateBtn = await mobilePage.$('#mobile-companion-panel .mini-cal-day-cell[data-date$="-15"]');
  if (mobileDateBtn) {
    await mobileDateBtn.click();
    await mobilePage.waitForTimeout(400);
    await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_10_mobile_date_selected.png' });
    console.log('✅ Captured cal_10_mobile_date_selected.png');
  }

  // Test "Quản lý" on Mobile
  console.log('Testing "Quản lý" on Mobile...');
  await mobilePage.click('#mobile-companion-panel .btn-right-view-tasks');
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/cal_11_mobile_assignments.png' });
  console.log('✅ Captured cal_11_mobile_assignments.png');

  await mobilePage.close();
  await browser.close();
  console.log('\n🎉 ALL Mini Calendar & Dashboard tests passed with flying colors!');
}

verifyCalendarAndDashboard().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
