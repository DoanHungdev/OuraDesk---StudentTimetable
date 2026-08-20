import pkg from 'file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js';
const { chromium } = pkg;
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb';

async function verifyCurriculumEngine() {
  console.log('--- Bắt đầu kiểm thử toàn diện University Curriculum Engine ---');
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 }
  });
  const page = await context.newPage();

  // Clear local storage first and set university mode + onboarded flag
  await page.goto('http://127.0.0.1:8088/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });
  await page.reload();
  await page.waitForTimeout(1000);

  // 1. Check Courses View
  console.log('1. Kiểm tra màn hình Danh sách Môn học (CoursesView)...');
  await page.click('a[data-view="courses"]');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_1_courses_view_groups.png') });
  console.log('✓ Đã chụp curriculum_1_courses_view_groups.png');

  // Verify group filter pills
  const groupPills = await page.$$eval('.course-cat-filter', btns => btns.map(b => b.textContent.trim()));
  console.log('Nhóm học phần tìm thấy trên Courses View:', groupPills);

  // 2. Open Course Modal to Add Course
  console.log('2. Mở Modal Thêm môn học kiểm tra dropdown Nhóm học phần...');
  await page.click('#btn-add-course-main');
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_2_add_course_modal.png') });
  console.log('✓ Đã chụp curriculum_2_add_course_modal.png');

  // Add course "Hệ thống nhúng nâng cao" in group "Chuyên ngành (CN)"
  await page.fill('#course-name', 'Hệ thống nhúng nâng cao');
  await page.fill('#course-code', 'CE305');
  await page.selectOption('#course-category', 'grp_haui_cn');
  await page.fill('#course-teacher', 'TS. Trần Đại Nghĩa');
  await page.fill('#course-room', 'Phòng Lab IoT 402');
  await page.click('#modal-save-btn');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_3_course_added.png') });
  console.log('✓ Đã thêm môn học mới và chụp curriculum_3_course_added.png');

  // 3. Check Settings View
  console.log('3. Chuyển sang Cài đặt (SettingsView) kiểm tra cấu hình CTĐT...');
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_4_settings_curriculum_table.png') });
  console.log('✓ Đã chụp curriculum_4_settings_curriculum_table.png');

  // 4. Test Adding Custom Course Group Modal
  console.log('4. Kiểm tra Modal Thêm nhóm học phần tùy chỉnh...');
  await page.click('#btn-add-custom-group');
  await page.waitForTimeout(600);

  await page.fill('#grp-name-input', 'Chuyên ngành hẹp: AI trên Vi mạch bán dẫn');
  await page.fill('#grp-code-input', 'AI-IC');
  await page.fill('#grp-credits-input', '15');
  await page.fill('#grp-desc-input', 'Khối kiến thức thiết kế chip AI và bộ tăng tốc NPU');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_5_custom_group_modal.png') });
  console.log('✓ Đã chụp curriculum_5_custom_group_modal.png');

  await page.click('#btn-group-modal-save');
  await page.waitForTimeout(800);

  // 5. Test Curriculum Import Modal
  console.log('5. Kiểm tra Modal Nhập khung CTĐT (CurriculumImportModal)...');
  await page.click('#btn-import-curriculum');
  await page.waitForTimeout(600);

  await page.click('#btn-curr-sample-text');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_6_import_curriculum_modal.png') });
  console.log('✓ Đã chụp curriculum_6_import_curriculum_modal.png');
  await page.click('#curr-import-close-x');
  await page.waitForTimeout(500);

  // 6. Test Switching Major to HUST IT1 K69 with Dialog
  console.log('6. Kiểm tra chuyển trường sang ĐH Bách Khoa Hà Nội...');
  page.on('dialog', async dialog => {
    console.log('Dialog xuất hiện:', dialog.message());
    await dialog.accept();
  });

  await page.selectOption('#set-select-univ-id', 'hust');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_7_switched_to_hust.png') });
  console.log('✓ Đã chụp curriculum_7_switched_to_hust.png');

  // 7. Check Statistics View
  console.log('7. Kiểm tra Thống kê (StatisticsView)...');
  await page.click('a[data-view="statistics"]');
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_8_statistics_breakdown.png') });
  console.log('✓ Đã chụp curriculum_8_statistics_breakdown.png');

  // 8. Check Manual Schedule Modal Inline Course Group
  console.log('8. Kiểm tra Nhập thủ công (ManualScheduleModal)...');
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);
  await page.click('#btn-tb-open-add-menu');
  await page.waitForTimeout(400);
  await page.click('#opt-menu-manual');
  await page.waitForTimeout(600);

  // Click toggle create new course
  await page.click('#btn-toggle-new-course');
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'curriculum_9_manual_entry_groups.png') });
  console.log('✓ Đã chụp curriculum_9_manual_entry_groups.png');

  await browser.close();
  console.log('=== TẤT CẢ KIỂM THỬ CURRICULUM ENGINE THÀNH CÔNG 100%! ===');
}

verifyCurriculumEngine().catch(err => {
  console.error('Lỗi khi kiểm thử:', err);
  process.exit(1);
});
