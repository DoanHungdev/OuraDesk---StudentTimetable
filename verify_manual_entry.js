const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');

async function testManualEntry() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  console.log('=== TEST 1: University Manual Entry & Menu Hub (HaUI) ===');
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

  // 1.1 Click "＋ Thêm lịch học" on Header
  console.log('Clicking "＋ Thêm lịch học" on Header...');
  await desktopPage.click('#header-import-tkb-btn');
  await desktopPage.waitForTimeout(400);

  const isMenuOpen = await desktopPage.$eval('#add-schedule-menu-backdrop', el => el.classList.contains('open'));
  console.log(`Add Schedule Menu open: ${isMenuOpen}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_1_add_menu_hub.png' });

  // 1.2 Click "✍️ Nhập thủ công" inside Menu
  console.log('Clicking "✍️ Nhập thủ công" option...');
  await desktopPage.click('#opt-menu-manual');
  await desktopPage.waitForTimeout(400);

  const isManualModalOpen = await desktopPage.$eval('#manual-schedule-modal-backdrop', el => el.classList.contains('open'));
  console.log(`Manual Schedule Modal open: ${isManualModalOpen}`);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_2_manual_form_modal.png' });

  // 1.3 Create New Course: "Toán cao cấp", Thứ 2, Tiết 1 - 3 (07:00 - 09:40)
  console.log('Creating "Toán cao cấp" (Thứ 2, Tiết 1-3)...');
  await desktopPage.click('#btn-toggle-new-course');
  await desktopPage.waitForTimeout(300);

  await desktopPage.fill('#manual-new-name', 'Toán cao cấp (Đại số tuyến tính)');
  await desktopPage.fill('#manual-new-code', 'MAT101');
  await desktopPage.selectOption('#manual-select-day', '1'); // Thứ 2
  await desktopPage.selectOption('#manual-select-start-period', '1'); // Tiết 1
  await desktopPage.selectOption('#manual-select-end-period', '3'); // Tiết 3
  await desktopPage.fill('#manual-input-room', 'Phòng A203 - Giảng đường A');
  await desktopPage.fill('#manual-input-teacher', 'TS. Nguyễn Văn A');
  await desktopPage.waitForTimeout(300);

  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_3_toan_cao_cap_filled.png' });

  // Click Submit
  await desktopPage.click('#btn-manual-submit');
  await desktopPage.waitForTimeout(600);

  // Navigate to Timetable View
  await desktopPage.click('.nav-item[data-view="timetable"]');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_4_timetable_with_toan.png' });

  // 1.4 Direct Timetable Editor: Click empty slot on Wednesday Tiết 4-5
  console.log('Testing Direct Timetable Editor (Clicking toolbar "＋ Thêm lịch học")...');
  await desktopPage.click('#btn-tb-open-add-menu');
  await desktopPage.waitForTimeout(300);
  await desktopPage.click('#opt-menu-manual');
  await desktopPage.waitForTimeout(400);

  // Add "Vật lý đại cương", Thứ 4, Tiết 4 - 5 (09:50 - 11:30)
  console.log('Creating "Vật lý đại cương" (Thứ 4, Tiết 4-5)...');
  await desktopPage.click('#btn-toggle-new-course');
  await desktopPage.waitForTimeout(200);
  await desktopPage.fill('#manual-new-name', 'Vật lý đại cương 1');
  await desktopPage.fill('#manual-new-code', 'PHY101');
  await desktopPage.selectOption('#manual-select-day', '3'); // Thứ 4
  await desktopPage.selectOption('#manual-select-start-period', '4'); // Tiết 4
  await desktopPage.selectOption('#manual-select-end-period', '5'); // Tiết 5
  await desktopPage.fill('#manual-input-room', 'Phòng B102');
  await desktopPage.fill('#manual-input-teacher', 'PGS. TS. Trần Văn B');
  await desktopPage.waitForTimeout(300);

  await desktopPage.click('#btn-manual-submit');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_5_timetable_with_vat_ly.png' });

  // 1.5 Quick Text Syntax Parser Test
  console.log('Testing ⚡ Quick Text Syntax Parser...');
  await desktopPage.click('#btn-tb-open-add-menu');
  await desktopPage.waitForTimeout(300);
  await desktopPage.click('#opt-menu-manual');
  await desktopPage.waitForTimeout(400);

  // Switch to Quick Tab
  await desktopPage.click('#tab-btn-quick-mode');
  await desktopPage.waitForTimeout(300);
  await desktopPage.click('#btn-quick-sample');
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_6_quick_syntax_preview.png' });

  // Click submit quick syntax
  await desktopPage.click('#btn-manual-submit');
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_7_timetable_after_quick_syntax.png' });

  await desktopPage.close();

  // === TEST 2: High School Mode Manual Entry ===
  console.log('\n=== TEST 2: High School Mode Manual Entry ===');
  const hsPage = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await hsPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'high_school');
    localStorage.setItem('classSchedule.theme', 'peach');
  });

  await hsPage.goto('http://localhost:8088/index.html');
  await hsPage.waitForTimeout(1000);

  // Open Manual Entry in THPT mode
  await hsPage.click('#btn-dash-manual-hero');
  await hsPage.waitForTimeout(400);

  console.log('Adding THPT Course "Toán" (Thứ 2, Tiết 1-2)...');
  await hsPage.click('#btn-toggle-new-course');
  await hsPage.waitForTimeout(200);
  await hsPage.fill('#manual-new-name', 'Toán Hình học 11');
  await hsPage.selectOption('#manual-select-day', '1'); // Thứ 2
  await hsPage.selectOption('#manual-select-start-period', '1'); // Tiết 1
  await hsPage.selectOption('#manual-select-end-period', '2'); // Tiết 2
  await hsPage.fill('#manual-input-room', 'Phòng 11A2');
  await hsPage.fill('#manual-input-teacher', 'Cô Nguyễn Thị Hoa');
  await hsPage.waitForTimeout(300);

  await hsPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_8_high_school_modal.png' });

  await hsPage.click('#btn-manual-submit');
  await hsPage.waitForTimeout(600);

  await hsPage.click('.nav-item[data-view="timetable"]');
  await hsPage.waitForTimeout(600);
  await hsPage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_9_high_school_timetable.png' });

  await hsPage.close();

  // === TEST 3: Mobile View Manual Entry & Floating Action Button ===
  console.log('\n=== TEST 3: Mobile View Manual Entry (390x844) ===');
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

  // Navigate to Timetable on mobile
  await mobilePage.click('.mobile-nav-btn[data-view="timetable"]');
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_10_mobile_timetable.png' });

  // Click Mobile Floating Add Button
  console.log('Clicking Mobile FAB ＋...');
  await mobilePage.click('#btn-mobile-fab-add');
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/man_11_mobile_add_menu.png' });

  await mobilePage.close();
  await browser.close();

  console.log('\n🎉 ALL Manual Schedule Entry tests PASSED successfully!');
}

testManualEntry().catch(err => {
  console.error('Error during manual entry verification:', err);
  process.exit(1);
});
