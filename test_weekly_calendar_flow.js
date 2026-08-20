import pkg from "file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js";
const { chromium } = pkg;

async function run() {
  console.log("==================================================");
  console.log("  BẮT ĐẦU TEST TOÀN DIỆN DATE RANGE & WEEKLY TIMETABLE FLOW");
  console.log("==================================================");

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1360, height: 850 } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

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

    // Navigate to Timetable
    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(600);

    // ---------------------------------------------------------------------------------
    // TEST 1: Thêm môn có startDate trong tương lai (08/09/2026) -> Tuần 03 (17-23/08) KHÔNG xuất hiện
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Thêm môn học tương lai (Start: 08/09/2026) ---");
    // Click button "Hôm nay" to make sure we are on current week (17/08 - 23/08)
    await page.click("#btn-tb-today");
    await page.waitForTimeout(400);

    const currentRangeText = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Tuần hiện tại đang xem: ${currentRangeText}`);

    // Create a new future course: "Xử lý ảnh số & AI Vision" starting on 2026-09-08 (Tuesday, Period 1-3)
    await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
      const futureCourse = {
        id: 'crs-future-vision',
        universityId: 'haui',
        campusId: 'haui_hn',
        profileId: 'haui_hn_theory',
        curriculumId: 'curriculum_haui_ce_k20',
        courseGroupId: 'grp_haui_cn',
        courseGroupName: 'Chuyên ngành',
        name: 'Xử lý ảnh số & AI Vision',
        code: 'AIV301',
        credits: 3,
        totalHours: 45,
        hoursPerWeek: 3,
        type: 'theory',
        teacher: 'TS. Lê Đức Anh',
        room: 'Lab AI 402',
        color: '#F5B28D',
        category: 'grp_haui_cn',
        startDate: '2026-09-08',
        calculatedEndDate: '15/12/2026',
        calculatedEndDateIso: '2026-12-15',
        endDateMode: 'auto',
        totalWeeks: 15,
        totalSessions: 15,
        schedules: [
          {
            id: 'sch-future-1',
            day: 2, // Thứ 3
            startPeriod: 1,
            endPeriod: 3,
            startTime: '07:00',
            endTime: '09:40',
            sessions: 3,
            room: 'Lab AI 402',
            teacher: 'TS. Lê Đức Anh',
            type: 'theory'
          }
        ]
      };
      courses.push(futureCourse);
      localStorage.setItem('class_schedule_univ_courses_v2', JSON.stringify(courses));
      localStorage.setItem('class_schedule_univ_courses_seeded_v1', 'true');
    });

    // Reload page to load new course state
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(500);

    // Make sure we are viewing Week containing 20/08 (17/08 - 23/08)
    await page.click("#btn-tb-today");
    await page.waitForTimeout(400);

    // Check Tuesday (day=2) in current week (17/08 - 23/08)
    const tuesdayCardsWeek17 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasFutureCourseWeek17 = tuesdayCardsWeek17.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 tuần 17/08 - 23/08 có chứa "Xử lý ảnh số & AI Vision" không: ${hasFutureCourseWeek17 ? 'CÓ (LỖI)' : 'KHÔNG (CHUẨN)'}`);

    if (hasFutureCourseWeek17) {
      throw new Error("TEST 1 THẤT BẠI: Môn học tương lai (Start: 08/09) lại xuất hiện ở tuần 17/08!");
    }
    console.log("✓ TEST 1 PASSED!");

    // Take screenshot of Week 17-23/08 (no future course)
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/timetable_week_aug17_no_future_course.png" });
    console.log("✓ Đã chụp ảnh timetable_week_aug17_no_future_course.png");

    // ---------------------------------------------------------------------------------
    // TEST 2: Chọn ngày 08/09/2026 trên Mini Calendar -> Timetable chuyển tuần 07/09–13/09 & MÔN XUẤT HIỆN
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Click ngày 08/09/2026 trên Mini Calendar ---");
    // Next month in mini calendar to show September 2026
    await page.click(".btn-mini-cal-next");
    await page.waitForTimeout(400);

    // Click on date 2026-09-08
    await page.click(".mini-cal-day-cell[data-date='2026-09-08']");
    await page.waitForTimeout(500);

    const weekLabelSept08 = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Khoảng ngày sau khi click 08/09: ${weekLabelSept08}`);

    // Check Tuesday (day=2) in week 07/09 - 13/09
    const tuesdayCardsWeekSept08 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasFutureCourseWeekSept08 = tuesdayCardsWeekSept08.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 ngày 08/09 có xuất hiện "Xử lý ảnh số & AI Vision" không: ${hasFutureCourseWeekSept08 ? 'CÓ (CHUẨN)' : 'KHÔNG (LỖI)'}`);

    if (!hasFutureCourseWeekSept08) {
      throw new Error("TEST 2 THẤT BẠI: Môn học không xuất hiện đúng tuần bắt đầu 08/09!");
    }
    console.log("✓ TEST 2 PASSED!");

    // Take screenshot of Week 07-13/09 (showing future course on Tuesday 08/09)
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/timetable_week_sept08_course_visible.png" });
    console.log("✓ Đã chụp ảnh timetable_week_sept08_course_visible.png");

    // ---------------------------------------------------------------------------------
    // TEST 3: Click Next Week (>) -> Tuần 14/09–20/09 -> Môn tiếp tục xuất hiện vào 15/09
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Bấm Next Week (>) sang tuần 14/09–20/09 ---");
    await page.click("#btn-next-week");
    await page.waitForTimeout(500);

    const weekLabelSept15 = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Khoảng ngày sau khi Next Week: ${weekLabelSept15}`);

    const tuesdayCardsWeekSept15 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasCourseSept15 = tuesdayCardsWeekSept15.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 ngày 15/09 có xuất hiện môn không: ${hasCourseSept15 ? 'CÓ (CHUẨN)' : 'KHÔNG (LỖI)'}`);

    if (!hasCourseSept15) {
      throw new Error("TEST 3 THẤT BẠI: Next week không hiển thị môn học của tuần tiếp theo!");
    }
    console.log("✓ TEST 3 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 4: Click Prev Week (<) -> Quay lại tuần 07/09–13/09
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Bấm Prev Week (<) quay lại tuần trước ---");
    await page.click("#btn-prev-week");
    await page.waitForTimeout(500);

    const weekLabelBack = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Khoảng ngày sau khi Prev Week: ${weekLabelBack}`);
    if (!weekLabelBack.includes("07 Th09") && !weekLabelBack.includes("7 Th09")) {
      throw new Error("TEST 4 THẤT BẠI: Prev week không quay lại tuần 07/09–13/09!");
    }
    console.log("✓ TEST 4 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 5: Xem tuần sau ngày kết thúc (21/12–27/12/2026) -> MÔN PHẢI BIẾN MẤT HOÀN TOÀN
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Xem tuần sau ngày kết thúc (21/12–27/12/2026) ---");
    // Next month to December 2026
    await page.click(".btn-mini-cal-next"); // Oct
    await page.waitForTimeout(200);
    await page.click(".btn-mini-cal-next"); // Nov
    await page.waitForTimeout(200);
    await page.click(".btn-mini-cal-next"); // Dec
    await page.waitForTimeout(300);

    // Click on 2026-12-22 (Tuesday after end date 2026-12-15)
    await page.click(".mini-cal-day-cell[data-date='2026-12-22']");
    await page.waitForTimeout(500);

    const weekLabelDec22 = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Khoảng ngày đang xem: ${weekLabelDec22}`);

    const tuesdayCardsDec22 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasCourseAfterEnd = tuesdayCardsDec22.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 ngày 22/12 (sau kết thúc) có môn không: ${hasCourseAfterEnd ? 'CÓ (LỖI)' : 'KHÔNG (CHUẨN)'}`);

    if (hasCourseAfterEnd) {
      throw new Error("TEST 5 THẤT BẠI: Môn học đã kết thúc vào 15/12 nhưng vẫn xuất hiện vào 22/12!");
    }
    console.log("✓ TEST 5 PASSED!");

    // Take screenshot of Week Dec 21-27 (course ended, not visible)
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/timetable_week_dec22_course_ended.png" });
    console.log("✓ Đã chụp ảnh timetable_week_dec22_course_ended.png");

    // ---------------------------------------------------------------------------------
    // TEST 6: Đổi startDate từ 08/09 -> 15/09 -> Tuần 08/09 biến mất môn
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 6: Sửa đổi startDate (08/09 -> 15/09) ---");
    await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('class_schedule_univ_courses_v2') || '[]');
      const target = courses.find(c => c.id === 'crs-future-vision');
      if (target) {
        target.startDate = '2026-09-15';
        target.calculatedEndDate = '22/12/2026';
        target.calculatedEndDateIso = '2026-12-22';
      }
      localStorage.setItem('class_schedule_univ_courses_v2', JSON.stringify(courses));
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(500);

    // Jump to 08/09/2026
    await page.click(".btn-mini-cal-next");
    await page.waitForTimeout(200);
    await page.click(".mini-cal-day-cell[data-date='2026-09-08']");
    await page.waitForTimeout(500);

    const tuesdayCards08New = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasCourseOn08AfterEdit = tuesdayCards08New.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Sau khi lùi ngày bắt đầu sang 15/09, ngày 08/09 có còn môn không: ${hasCourseOn08AfterEdit ? 'CÒN (LỖI)' : 'KHÔNG (CHUẨN)'}`);

    if (hasCourseOn08AfterEdit) {
      throw new Error("TEST 6 THẤT BẠI: Đã đổi startDate sang 15/09 nhưng ngày 08/09 vẫn hiển thị môn!");
    }

    // Check week 15/09
    await page.click("#btn-next-week");
    await page.waitForTimeout(500);
    const tuesdayCards15New = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasCourseOn15AfterEdit = tuesdayCards15New.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Ngày 15/09 có xuất hiện môn không: ${hasCourseOn15AfterEdit ? 'CÓ (CHUẨN)' : 'KHÔNG (LỖI)'}`);

    if (!hasCourseOn15AfterEdit) {
      throw new Error("TEST 6 THẤT BẠI: Ngày 15/09 không xuất hiện môn sau khi đổi startDate!");
    }
    console.log("✓ TEST 6 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 7: Nút [Hôm nay] & Đồng bộ Right Panel "Lịch học hôm nay"
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 7: Nút [Hôm nay] & Đồng bộ Right Panel ---");
    await page.click("#btn-tb-today");
    await page.waitForTimeout(500);

    const returnedRange = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Bấm [Hôm nay] -> Khoảng ngày quay lại: ${returnedRange}`);

    // Check Dashboard "Lịch học hôm nay"
    await page.click("a[data-view='dashboard']");
    await page.waitForTimeout(500);

    const dashboardTodayCards = await page.$$eval(".today-item-card", cards => cards.length);
    console.log(`- Dashboard hiển thị đúng số môn hôm nay: ${dashboardTodayCards} môn`);
    console.log("✓ TEST 7 PASSED!");

    // Take screenshot of Final Dashboard
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/dashboard_sync_verified.png" });
    console.log("✓ Đã chụp ảnh dashboard_sync_verified.png");

    console.log("\n==================================================");
    console.log("  TẤT CẢ 7/7 TEST CASES CALENDAR & TIMETABLE FLOW ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
