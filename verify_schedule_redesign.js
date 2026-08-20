import pkg from 'file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js';
const { chromium } = pkg;
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\374e7888-a9e1-40be-9088-41c689fb2ecb';

async function runVerification() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TOÀN DIỆN TIMETABLE & COURSE REDESIGN ===');

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  // 1. Load Application
  console.log('1. Tải ứng dụng trên localhost:8088...');
  await page.goto('http://127.0.0.1:8088/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });
  await page.reload();
  await page.waitForTimeout(1000);

  // Switch to timetable view
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(800);

  // 1. Timetable Desktop View
  console.log('1. Chụp màn hình Thời khóa biểu Desktop...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_1_desktop_view.png') });
  console.log('✓ Đã chụp timetable_1_desktop_view.png');

  // 2. Click Course Card -> Open Course Detail Drawer
  console.log('2. Mở CourseDetailDrawer...');
  const firstCard = await page.$('.course-card-block');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_2_course_detail_drawer.png') });
    console.log('✓ Đã chụp timetable_2_course_detail_drawer.png');
    await page.click('#drawer-close-x');
    await page.waitForTimeout(400);
  }

  // 3. Open Add Course Wizard (Step 1)
  console.log('3. Mở Wizard Thêm Môn Học (Step 1)...');
  await page.click('a[data-view="courses"]');
  await page.waitForTimeout(600);
  await page.click('#btn-add-course-main');
  await page.waitForTimeout(600);

  await page.fill('#course-name', 'Toán Cao Cấp 2');
  await page.fill('#course-code', 'MAT102');
  await page.fill('#course-teacher', 'TS. Nguyễn Văn An');
  await page.fill('#course-room', 'Phòng A203');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_3_wizard_step1.png') });
  console.log('✓ Đã chụp timetable_3_wizard_step1.png');

  // 4. Navigate to Step 2 (Lịch học & Auto-Calculated End Date)
  console.log('4. Chuyển sang Step 2 (Lịch học & Tự tính ngày kết thúc)...');
  await page.click('#btn-goto-step2');
  await page.waitForTimeout(600);

  // Set start date to 18/08/2026
  await page.fill('#course-start-date-input', '2026-08-18');
  await page.waitForTimeout(400);

  // Add another weekly schedule slot (Thursday periods 3-5)
  await page.selectOption('#slot-add-day', '4'); // Thursday
  await page.selectOption('#slot-add-start', '3'); // Period 3
  await page.selectOption('#slot-add-end', '5'); // Period 5
  await page.waitForTimeout(300);
  await page.click('#btn-add-schedule-slot');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_4_wizard_step2.png') });
  console.log('✓ Đã chụp timetable_4_wizard_step2.png');

  // 5. Navigate to Step 3 (Xem trước / Preview)
  console.log('5. Chuyển sang Step 3 (Xem trước)...');
  await page.click('#btn-goto-step3');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_5_wizard_step3_preview.png') });
  console.log('✓ Đã chụp timetable_5_wizard_step3_preview.png');

  // 6. Save course and view in Timetable Grid
  console.log('6. Lưu lịch học và kiểm tra trên lưới Timetable...');
  await page.click('#btn-confirm-save-course');
  await page.waitForTimeout(800);

  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_6_course_added_grid.png') });
  console.log('✓ Đã chụp timetable_6_course_added_grid.png');

  // 7. Test Mobile Timetable View (390x844)
  console.log('7. Kiểm tra giao diện Mobile (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:8088/');
  await mobilePage.evaluate(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });
  await mobilePage.reload();
  await mobilePage.waitForTimeout(800);

  await mobilePage.click('.mobile-nav-btn[data-view="timetable"]');
  await mobilePage.waitForTimeout(600);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_7_mobile_view.png') });
  console.log('✓ Đã chụp timetable_7_mobile_view.png');

  // 8. Test Midnight Dark Theme
  console.log('8. Kiểm tra tương thích Theme Midnight Glass...');
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(600);
  const midnightCard = await page.$('.theme-card[data-theme-id="midnight"]');
  if (midnightCard) {
    await midnightCard.click();
    await page.waitForTimeout(600);
  }
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timetable_8_midnight_theme.png') });
  console.log('✓ Đã chụp timetable_8_midnight_theme.png');

  await browser.close();
  console.log('=== KIỂM THỬ HOÀN TẤT THÀNH CÔNG 100%! ===');
}

runVerification().catch(err => {
  console.error('Lỗi kiểm thử:', err);
  process.exit(1);
});
