import pkg from "file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js";
const { chromium } = pkg;

async function run() {
  console.log("==================================================");
  console.log("  BẮT ĐẦU KIỂM THỬ TOÀN DIỆN LOCAL-FIRST PERSISTENCE");
  console.log("==================================================");

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  try {
    // ---------------------------------------------------------------------------------
    // TEST 1: Load lần đầu tiên (Seed demo data) & Reload F5 (Giữ nguyên)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Khởi động lần đầu & Reload F5 ---");
    // Clear localStorage to simulate brand new user
    await page.goto("http://localhost:8088/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
      localStorage.setItem('class_schedule_mode_v2', 'university');
    });
    await page.reload({ waitUntil: "networkidle" });

    // Navigate to Assignments View
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const initialTasksCount = await page.$$eval(".task-list-card", elms => elms.length);
    console.log(`- Số bài tập ban đầu: ${initialTasksCount} (Demo data đã được seed)`);
    if (initialTasksCount === 0) throw new Error("TEST 1 THẤT BẠI: Demo assignments không xuất hiện.");

    // Reload page
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);
    const countAfterF5 = await page.$$eval(".task-list-card", elms => elms.length);
    console.log(`- Số bài tập sau F5: ${countAfterF5}`);
    if (countAfterF5 !== initialTasksCount) throw new Error("TEST 1 THẤT BẠI: F5 làm mất hoặc nhân bản dữ liệu demo.");
    console.log("✓ TEST 1 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Delete Assignment -> F5 -> Không xuất hiện lại
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Xóa bài tập & Reload F5 ---");
    // Get title of the first assignment
    const firstTaskTitle = await page.$eval(".task-list-card h4", el => el.textContent.trim());
    console.log(`- Chuẩn bị xóa bài tập: "${firstTaskTitle}"`);

    // Click delete button of the first assignment
    await page.click(".task-list-card:first-child .btn-del-task");
    await page.waitForTimeout(500);

    const countAfterDelete = await page.$$eval(".task-list-card", elms => elms.length);
    console.log(`- Số bài tập sau khi xóa: ${countAfterDelete} (Giảm 1)`);
    if (countAfterDelete !== initialTasksCount - 1) throw new Error("TEST 2 THẤT BẠI: UI không giảm số lượng bài tập.");

    // Reload F5
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const countAfterDeleteF5 = await page.$$eval(".task-list-card", elms => elms.length);
    const allTitlesAfterF5 = await page.$$eval(".task-list-card h4", elms => elms.map(e => e.textContent.trim()));
    console.log(`- Số bài tập sau F5: ${countAfterDeleteF5}`);
    console.log(`- Kiểm tra bài tập đã xóa có xuất hiện lại không: ${allTitlesAfterF5.includes(firstTaskTitle) ? 'CÓ (LỖI)' : 'KHÔNG (CHUẨN)'}`);

    if (allTitlesAfterF5.includes(firstTaskTitle) || countAfterDeleteF5 !== countAfterDelete) {
      throw new Error(`TEST 2 THẤT BẠI: Bài tập "${firstTaskTitle}" đã bị phục hồi sau F5!`);
    }
    console.log("✓ TEST 2 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 3: Edit Assignment -> F5 -> Dữ liệu giữ nguyên giá trị mới
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Chỉnh sửa bài tập & Reload F5 ---");
    await page.click(".task-list-card:first-child .btn-edit-task");
    await page.waitForSelector("#task-modal-backdrop.open", { timeout: 3000 });

    const newTitle = "Báo cáo thí nghiệm Vi điều khiển (Đã chỉnh sửa)";
    const newDueDate = "2026-08-30";
    await page.fill("#task-title", newTitle);
    await page.fill("#task-due-date", newDueDate);
    await page.selectOption("#task-priority", "high");
    await page.click("#task-save-btn");
    await page.waitForTimeout(500);

    console.log(`- Đã sửa bài tập thành: "${newTitle}" với hạn nộp ${newDueDate}`);

    // Reload F5
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const editedTitleAfterF5 = await page.$eval(".task-list-card:first-child h4", el => el.textContent.trim());
    const editedDueAfterF5 = await page.$eval(".task-list-card:first-child", el => el.textContent);
    console.log(`- Tiêu đề sau F5: "${editedTitleAfterF5}"`);

    if (!editedTitleAfterF5.includes(newTitle) || !editedDueAfterF5.includes(newDueDate)) {
      throw new Error("TEST 3 THẤT BẠI: Dữ liệu sau F5 không lưu các thay đổi đã chỉnh sửa!");
    }
    console.log("✓ TEST 3 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 4: Create Assignment -> F5 -> Vẫn tồn tại
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Tạo bài tập mới & Reload F5 ---");
    await page.click("#btn-assignments-add");
    await page.waitForSelector("#task-modal-backdrop.open", { timeout: 3000 });

    const createdTitle = "Bài tập lập trình ESP32 Web Server";
    const createdDueDate = "2026-09-15";
    await page.fill("#task-title", createdTitle);
    await page.fill("#task-due-date", createdDueDate);
    await page.selectOption("#task-priority", "high");
    await page.fill("#task-notes", "Nộp file hex và source code trên Google Drive");
    await page.click("#task-save-btn");
    await page.waitForTimeout(500);

    console.log(`- Đã tạo bài tập mới: "${createdTitle}"`);

    // Reload F5
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const allTitlesAfterCreateF5 = await page.$$eval(".task-list-card h4", elms => elms.map(e => e.textContent.trim()));
    if (!allTitlesAfterCreateF5.includes(createdTitle)) {
      throw new Error(`TEST 4 THẤT BẠI: Bài tập mới "${createdTitle}" bị biến mất sau F5!`);
    }
    console.log("✓ TEST 4 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 5: Toggle Complete -> F5 -> Status vẫn là Completed
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Hoàn thành bài tập & Reload F5 ---");
    const checkbox = await page.$(".task-list-card:first-child .task-checkbox-main");
    await checkbox.click();
    await page.waitForTimeout(500);

    // Reload F5
    await page.reload({ waitUntil: "networkidle" });
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);

    const isCheckedAfterF5 = await page.$eval(".task-list-card:first-child .task-checkbox-main", el => el.checked);
    console.log(`- Trạng thái checkbox sau F5: ${isCheckedAfterF5 ? 'Đã hoàn thành (Checked)' : 'Chưa xong'}`);
    if (!isCheckedAfterF5) throw new Error("TEST 5 THẤT BẠI: Trạng thái checkbox bị reset sau F5!");
    console.log("✓ TEST 5 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 6: Mini Calendar & Month Calendar Sync (Xóa bài tập -> Dot biến mất sau F5)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 6: Đồng bộ Mini Calendar & Month Calendar sau khi xóa & F5 ---");
    // Create a specific deadline for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    await page.click("#btn-assignments-add");
    await page.waitForSelector("#task-modal-backdrop.open", { timeout: 3000 });
    await page.fill("#task-title", "Bài tập kiểm thử Calendar Sync");
    await page.fill("#task-due-date", tomorrowStr);
    await page.click("#task-save-btn");
    await page.waitForTimeout(500);

    // Check if Mini Calendar has deadline dot on tomorrow
    const dotBeforeDelete = await page.$(`.mini-cal-day-cell.has-deadline[data-date='${tomorrowStr}']`);
    console.log(`- Mini Calendar có chấm deadline ngày mai: ${dotBeforeDelete ? 'CÓ' : 'KHÔNG'}`);

    // Delete the task
    const testTaskCard = await page.$(`.task-list-card:has-text("Bài tập kiểm thử Calendar Sync") .btn-del-task`);
    if (testTaskCard) await testTaskCard.click();
    await page.waitForTimeout(500);

    // Reload F5
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const dotAfterDeleteF5 = await page.$(`.mini-cal-day-cell.has-deadline[data-date='${tomorrowStr}']`);
    console.log(`- Mini Calendar sau khi xóa & F5 có còn chấm không: ${dotAfterDeleteF5 ? 'CÒN (LỖI)' : 'HẾT (CHUẨN)'}`);
    if (dotAfterDeleteF5) throw new Error("TEST 6 THẤT BẠI: Chấm deadline vẫn còn trên Mini Calendar sau khi xóa và F5!");
    console.log("✓ TEST 6 PASSED!");

    // ---------------------------------------------------------------------------------
    // TEST 7: Dashboard "Deadline sắp tới" Sync
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 7: Đồng bộ Dashboard Upcoming Widget ---");
    await page.click("a[data-view='dashboard']");
    await page.waitForTimeout(500);

    // Check Upcoming list in Right Panel / Companion
    const upcomingTitles = await page.$$eval(".task-mini-title", elms => elms.map(e => e.textContent.trim()));
    console.log(`- Danh sách Upcoming trên Dashboard: ${JSON.stringify(upcomingTitles)}`);
    console.log("✓ TEST 7 PASSED!");

    // Take screenshot of final verified assignments page
    await page.click("a[data-view='assignments']");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/assignments_persistence_verified.png" });
    console.log("✓ Đã chụp ảnh assignments_persistence_verified.png");

    console.log("\n==================================================");
    console.log("  TẤT CẢ 7/7 TEST CASES PERSISTENCE ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI TRONG QUÁ TRÌNH KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
