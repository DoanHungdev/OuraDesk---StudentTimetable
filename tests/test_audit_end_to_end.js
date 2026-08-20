import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST TOÀN DIỆN AUDIT & END-TO-END FLOW (P0/P1/P2)");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    // ---------------------------------------------------------------------------------
    // SETUP: Khởi tạo ứng dụng ở chế độ Đại học
    // ---------------------------------------------------------------------------------
    await page.goto("http://localhost:8088/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
      localStorage.setItem('class_schedule_mode_v2', 'university');
    });
    await page.reload({ waitUntil: "networkidle" });

    // ---------------------------------------------------------------------------------
    // TEST 1: Tạo môn qua ManualScheduleModal (Form Entry với startDate tương lai)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Tạo môn mới qua ManualScheduleModal với StartDate tương lai ---");
    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(500);

    // Mở modal nhập thủ công
    await page.evaluate(() => {
      window.classScheduleApp.openManualSchedule();
    });
    await page.waitForTimeout(500);

    // Bật form tạo môn mới nếu chưa hiển thị
    const isSelectWrapHidden = await page.$eval("#manual-new-course-form-wrap", el => el.style.display !== 'none');
    if (!isSelectWrapHidden) {
      await page.click("#btn-toggle-new-course");
      await page.waitForTimeout(300);
    }

    // Nhập thông tin môn học
    await page.fill("#manual-new-name", "Học sâu & Mạng nơ-ron");
    await page.fill("#manual-new-code", "DL401");
    await page.fill("#manual-new-start-date", "2026-09-08"); // Bắt đầu vào Thứ 3 tuần 06

    // Chọn Thứ 3, Tiết 1-3
    await page.selectOption("#manual-select-day", "2");
    await page.selectOption("#manual-select-start-period", "1");
    await page.selectOption("#manual-select-end-period", "3");

    // Bấm lưu
    await page.click("#btn-manual-submit");
    await page.waitForTimeout(600);

    // Kiểm tra trong Storage
    const savedCourses = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
    });
    const dlCourse = savedCourses.find(c => c.code === 'DL401');

    if (!dlCourse) {
      throw new Error("TEST 1 THẤT BẠI: Không tìm thấy môn DL401 trong Storage!");
    }
    console.log(`- Môn đã lưu có startDate: ${dlCourse.startDate}`);
    console.log(`- Ngày kết thúc tự động tính: ${dlCourse.calculatedEndDateIso} (${dlCourse.calculatedEndDate})`);
    console.log(`- Tổng số tuần: ${dlCourse.totalWeeks}, Tổng số buổi: ${dlCourse.totalSessions}`);

    if (dlCourse.startDate !== '2026-09-08') {
      throw new Error(`TEST 1 THẤT BẠI: startDate không được lưu đúng! (Nhận được: ${dlCourse.startDate})`);
    }
    if (!dlCourse.calculatedEndDateIso) {
      throw new Error("TEST 1 THẤT BẠI: calculatedEndDateIso bị thiếu!");
    }
    console.log("✓ TEST 1 PASSED: Manual Form lưu chính xác startDate & calculatedEndDate!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Kiểm tra môn DL401 KHÔNG xuất hiện ở tuần 17/08 và XUẤT HIỆN ở tuần 08/09
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Kiểm tra hiển thị trên Timetable theo Date Range ---");
    // Xem tuần hiện tại (17/08 - 23/08)
    await page.click("#btn-tb-today");
    await page.waitForTimeout(400);

    const tuesdayCardsCurrent = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasDlOnAug17 = tuesdayCardsCurrent.some(t => t.includes('Học sâu & Mạng nơ-ron'));
    console.log(`- Tuần 17/08 có chứa DL401 không: ${hasDlOnAug17 ? 'CÓ (LỖI)' : 'KHÔNG (CHUẨN)'}`);
    if (hasDlOnAug17) {
      throw new Error("TEST 2 THẤT BẠI: Môn bắt đầu tháng 9 lại xuất hiện ở tuần 17/08!");
    }

    // Chuyển sang tháng 9 và chọn 08/09 trên Mini Calendar
    await page.click(".btn-mini-cal-next");
    await page.waitForTimeout(300);
    await page.click(".mini-cal-day-cell[data-date='2026-09-08']");
    await page.waitForTimeout(500);

    const tuesdayCardsSept08 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasDlOnSept08 = tuesdayCardsSept08.some(t => t.includes('Học sâu & Mạng nơ-ron'));
    console.log(`- Tuần 08/09 có chứa DL401 không: ${hasDlOnSept08 ? 'CÓ (CHUẨN)' : 'KHÔNG (LỖI)'}`);
    if (!hasDlOnSept08) {
      throw new Error("TEST 2 THẤT BẠI: Môn không xuất hiện ở tuần 08/09!");
    }
    console.log("✓ TEST 2 PASSED: Recurrence engine hiển thị đúng tuần bắt đầu!");

    // ---------------------------------------------------------------------------------
    // TEST 3: Tạo môn bằng Quick Syntax -> Kiểm tra tự động tính startDate & calculatedEndDate
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Quick Syntax Parser tự động tính metadata ---");
    await page.evaluate(() => {
      window.classScheduleApp.openManualSchedule();
    });
    await page.waitForTimeout(400);

    // Chuyển sang tab Quick Syntax
    await page.click("#tab-btn-quick-mode");
    await page.waitForTimeout(200);

    await page.fill("#quick-syntax-input", "Thứ 4 | Tiết 4-5 | An toàn thông tin | Lab Security | SEC301");
    await page.click("#btn-manual-submit");
    await page.waitForTimeout(600);

    const coursesAfterQuick = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
    });
    const secCourse = coursesAfterQuick.find(c => c.code === 'SEC301');

    if (!secCourse) {
      throw new Error("TEST 3 THẤT BẠI: Môn SEC301 tạo bằng Quick mode không có trong Storage!");
    }
    console.log(`- Môn Quick Mode có startDate: ${secCourse.startDate}`);
    console.log(`- calculatedEndDateIso: ${secCourse.calculatedEndDateIso}`);
    console.log(`- totalWeeks: ${secCourse.totalWeeks}, totalSessions: ${secCourse.totalSessions}`);

    if (!secCourse.startDate || !secCourse.calculatedEndDateIso) {
      throw new Error("TEST 3 THẤT BẠI: Quick mode không tự động gán startDate hoặc calculatedEndDate!");
    }
    console.log("✓ TEST 3 PASSED: Quick Syntax tự động tính toán metadata hoàn hảo!");

    // ---------------------------------------------------------------------------------
    // TEST 4: CourseModal 3-Step Wizard bảo toàn startDate
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: CourseModal Wizard bảo toàn startDate ---");
    await page.evaluate(() => {
      window.classScheduleApp.openAddCourseModal();
    });
    await page.waitForTimeout(400);

    // Step 1: Thông tin môn
    await page.fill("#course-name", "Hệ thống nhúng IoT");
    await page.fill("#course-code", "IOT302");
    await page.click("#btn-goto-step2");
    await page.waitForTimeout(400);

    // Step 2: Chọn startDate
    await page.fill("#course-start-date-input", "2026-09-14"); // Bắt đầu 14/09
    await page.click("#btn-goto-step3");
    await page.waitForTimeout(400);

    // Step 3: Xác nhận lưu
    await page.click("#btn-confirm-save-course");
    await page.waitForTimeout(600);

    const coursesAfterWizard = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
    });
    const iotCourse = coursesAfterWizard.find(c => c.code === 'IOT302');

    if (!iotCourse || iotCourse.startDate !== '2026-09-14') {
      throw new Error(`TEST 4 THẤT BẠI: CourseModal không bảo toàn startDate! (${iotCourse?.startDate})`);
    }
    console.log("✓ TEST 4 PASSED: CourseModal Wizard lưu chuẩn xác startDate!");

    // Capture screenshot proof
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/audit_end_to_end_verified.png" });
    console.log("✓ Đã chụp ảnh audit_end_to_end_verified.png");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST AUDIT ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
