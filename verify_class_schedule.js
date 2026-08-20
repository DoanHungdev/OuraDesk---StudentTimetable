const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb';

async function run() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1540, height: 920 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  // 1. Test University Mode (Nguyễn Doãn Tuấn Hưng - HaUI)
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });

  console.log('Navigating to http://localhost:8088/index.html (University Mode)...');
  await page.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Dashboard View (University Mode)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_university_dashboard.png'), fullPage: true });
  console.log('✅ Captured class_schedule_university_dashboard.png');

  // 2. Timetable View (University Mode)
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_university_timetable.png'), fullPage: true });
  console.log('✅ Captured class_schedule_university_timetable.png');

  // 3. Switch to High School Mode (Nguyễn Doãn Uy Vũ - THPT Đông Anh)
  await page.click('#btn-sidebar-switch-mode');
  await page.waitForTimeout(500);

  // 4. Dashboard View (High School Mode)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_highschool_dashboard.png'), fullPage: true });
  console.log('✅ Captured class_schedule_highschool_dashboard.png');

  // 5. Open Import Modal
  await page.click('#header-import-tkb-btn');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_import_modal.png'), fullPage: true });
  console.log('✅ Captured class_schedule_import_modal.png');

  // 6. Click "Dùng ảnh mẫu thử nghiệm" to trigger OCR Matrix Parser & Confidence Review
  await page.click('#btn-demo-photo-import');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_confidence_review.png'), fullPage: true });
  console.log('✅ Captured class_schedule_confidence_review.png');

  // 7. Confirm Timetable creation
  await page.click('#btn-conf-review-confirm');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_highschool_timetable.png'), fullPage: true });
  console.log('✅ Captured class_schedule_highschool_timetable.png');

  // 8. Homework Kanban View
  await page.click('a[data-view="homework"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_homework.png'), fullPage: true });
  console.log('✅ Captured class_schedule_homework.png');

  // 9. Exams View
  await page.click('a[data-view="exams"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_exams.png'), fullPage: true });
  console.log('✅ Captured class_schedule_exams.png');

  // 10. Settings View
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_settings.png'), fullPage: true });
  console.log('✅ Captured class_schedule_settings.png');

  // 11. Mobile Viewport (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'high_school');
  });
  await mobilePage.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'class_schedule_mobile.png') });
  console.log('✅ Captured class_schedule_mobile.png');

  await browser.close();
  console.log('🎉 All verification screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
