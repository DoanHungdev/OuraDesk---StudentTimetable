import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST WEEKLY CALENDAR FLOW & RECURRENCE ENGINE");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    await page.goto("http://localhost:8088/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
      localStorage.setItem('class_schedule_mode_v2', 'university');
    });
    await page.reload({ waitUntil: "networkidle" });

    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(500);

    // Click button "Hôm nay"
    await page.click("#btn-tb-today");
    await page.waitForTimeout(400);

    const currentRangeText = await page.$eval(".current-week-label", el => el.textContent.trim());
    console.log(`- Tuần hiện tại đang xem: ${currentRangeText}`);

    // Create a new future course: "Xử lý ảnh số & AI Vision" starting on 2026-09-08
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
            day: 2,
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

    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='timetable']");
    await page.waitForTimeout(500);

    await page.click("#btn-tb-today");
    await page.waitForTimeout(400);

    const tuesdayCardsWeek17 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasFutureCourseWeek17 = tuesdayCardsWeek17.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 tuần 17/08 có chứa môn tương lai không: ${hasFutureCourseWeek17 ? 'CÓ (LỖI)' : 'KHÔNG (CHUẨN)'}`);

    if (hasFutureCourseWeek17) {
      throw new Error("TEST FAILED: Môn tương lai xuất hiện trước ngày bắt đầu!");
    }

    // Mini Calendar: Jump to 08/09
    await page.click(".btn-mini-cal-next");
    await page.waitForTimeout(300);
    await page.click(".mini-cal-day-cell[data-date='2026-09-08']");
    await page.waitForTimeout(500);

    const tuesdayCardsSept08 = await page.$$eval(".day-column[data-day='2'] .course-card-block", cards => cards.map(c => c.textContent));
    const hasCourseSept08 = tuesdayCardsSept08.some(txt => txt.includes('Xử lý ảnh số & AI Vision'));
    console.log(`- Thứ 3 ngày 08/09 có xuất hiện môn không: ${hasCourseSept08 ? 'CÓ (CHUẨN)' : 'KHÔNG (LỖI)'}`);

    if (!hasCourseSept08) {
      throw new Error("TEST FAILED: Môn học không xuất hiện ở tuần bắt đầu!");
    }

    console.log("✓ TEST PASSED: Weekly Calendar Flow & Recurrence hoàn toàn chính xác!");
  } catch (err) {
    console.error("❌ LỖI:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
