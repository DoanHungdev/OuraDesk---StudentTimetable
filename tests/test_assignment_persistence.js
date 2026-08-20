import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST ASSIGNMENT & HOMEWORK PERSISTENCE (LOCAL-FIRST)");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
      localStorage.setItem('class_schedule_mode_v2', 'university');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    // Navigate to Assignments
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    // Verify initial count
    const initialCount = await page.$$eval(".task-list-card", rows => rows.length);
    console.log(`- Số deadline ban đầu: ${initialCount}`);

    // Add new assignment
    await page.click("#btn-assignments-add");
    await page.waitForTimeout(400);

    await page.fill("#task-title", "Báo cáo tiến độ đề tài NCKH");
    await page.fill("#task-due-date", "2026-08-30");
    await page.click("#task-save-btn");
    await page.waitForTimeout(600);

    const countAfterAdd = await page.$$eval(".task-list-card", rows => rows.length);
    console.log(`- Số deadline sau khi thêm: ${countAfterAdd}`);

    if (countAfterAdd !== initialCount + 1) {
      throw new Error(`Thêm deadline thất bại! (Ban đầu: ${initialCount}, Sau thêm: ${countAfterAdd})`);
    }

    // Reload page to test persistence
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const countAfterReload = await page.$$eval(".task-list-card", rows => rows.length);
    console.log(`- Số deadline sau khi F5/Reload: ${countAfterReload}`);

    if (countAfterReload !== countAfterAdd) {
      throw new Error(`LỖI PERSISTENCE: Dữ liệu bị mất sau khi F5! (Trước: ${countAfterAdd}, Sau: ${countAfterReload})`);
    }

    console.log("✓ TEST PASSED: Dữ liệu deadline lưu trữ vĩnh viễn không mất khi reload!");
  } catch (err) {
    console.error("❌ LỖI:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
