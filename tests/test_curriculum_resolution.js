import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST CURRICULUM RESOLUTION & UX REFACTOR");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  // Auto accept all browser confirmation dialogs
  page.on('dialog', async dialog => {
    try {
      await dialog.accept();
    } catch (e) {}
  });

  try {
    // ---------------------------------------------------------------------------------
    // SETUP: Khởi tạo ứng dụng ở chế độ Đại học
    // ---------------------------------------------------------------------------------
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
      localStorage.setItem('class_schedule_mode_v2', 'university');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    // Navigate to Settings
    await page.click("a[data-view='settings']");
    await page.waitForTimeout(500);

    // ---------------------------------------------------------------------------------
    // TEST 1: HaUI + Kỹ thuật máy tính + Khóa 20 -> Tự động resolve
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: HaUI + Kỹ thuật máy tính + Khóa 20 -> Auto Resolve ---");
    const summaryText = await page.$eval(".settings-view-wrapper", el => el.innerText);

    if (!summaryText.includes("CHƯƠNG TRÌNH ĐÀO TẠO")) {
      throw new Error("TEST 1 FAILED: Không tìm thấy tiêu đề 'CHƯƠNG TRÌNH ĐÀO TẠO'!");
    }
    if (!summaryText.includes("Kỹ thuật máy tính")) {
      throw new Error("TEST 1 FAILED: Chưa hiển thị đúng ngành Kỹ thuật máy tính!");
    }
    if (!summaryText.includes("Khóa 20 · 2026–2027")) {
      throw new Error("TEST 1 FAILED: Chưa hiển thị đúng Khóa 20 · 2026–2027!");
    }
    if (!summaryText.includes("Đã tải khung chương trình")) {
      throw new Error("TEST 1 FAILED: Chưa hiển thị badge '✓ Đã tải khung chương trình'!");
    }

    console.log("✓ TEST 1 PASSED: Tự động resolve HaUI Kỹ thuật máy tính Khóa 20 hoàn hảo!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Đổi sang Ngành Công nghệ thông tin -> Tự động resolve
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Đổi sang Ngành Công nghệ thông tin -> Auto Resolve ---");
    await page.selectOption("#set-select-major-id", "haui_it");
    await page.waitForTimeout(600);

    const itSummaryText = await page.$eval(".settings-view-wrapper", el => el.innerText);
    if (!itSummaryText.includes("Công nghệ thông tin")) {
      throw new Error("TEST 2 FAILED: Chưa chuyển sang Ngành Công nghệ thông tin!");
    }
    console.log("✓ TEST 2 PASSED: Tự động resolve sang Khung CTĐT CNTT!");

    // ---------------------------------------------------------------------------------
    // TEST 3: Đổi sang Trường HUST + Ngành Khoa học máy tính + Khóa 69
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Đổi sang Trường HUST + IT1 + Khóa 69 ---");
    await page.selectOption("#set-select-univ-id", "hust");
    await page.waitForTimeout(600);
    await page.selectOption("#set-select-cohort", "69");
    await page.waitForTimeout(600);

    const hustSummaryText = await page.$eval(".settings-view-wrapper", el => el.innerText);
    console.log(`- Thông tin hiển thị: ${hustSummaryText.includes("Khoa học máy tính") ? "Khoa học máy tính (IT1)" : "Khác"}`);
    if (!hustSummaryText.includes("Khoa học máy tính") && !hustSummaryText.includes("Khóa 69")) {
      throw new Error("TEST 3 FAILED: Chưa resolve đúng CTĐT HUST!");
    }
    console.log("✓ TEST 3 PASSED: Tự động resolve CTĐT Đại học Bách Khoa Hà Nội!");

    // ---------------------------------------------------------------------------------
    // TEST 4: Chọn Khóa chưa có sẵn (Khóa 18 của HUST IT1) -> Hiển thị Empty Card
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Trường hợp ngành/khóa chưa có sẵn -> Hiển thị Empty Card ---");
    await page.selectOption("#set-select-cohort", "18");
    await page.waitForTimeout(600);

    const emptyText = await page.$eval(".settings-view-wrapper", el => el.innerText);
    const hasEmptyNotice = emptyText.includes("Chưa có khung chương trình cho ngành và khóa này");
    const hasImportBtn = await page.$("#btn-empty-import-curriculum") !== null;
    const hasCreateBtn = await page.$("#btn-empty-create-curriculum") !== null;

    console.log(`- Thông báo chưa có CTĐT: ${hasEmptyNotice ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Nút Nhập khung chương trình: ${hasImportBtn ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Nút Tạo khung chương trình thủ công: ${hasCreateBtn ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (!hasEmptyNotice || !hasImportBtn || !hasCreateBtn) {
      throw new Error("TEST 4 FAILED: Không hiển thị đúng Empty Card và Action Buttons!");
    }
    console.log("✓ TEST 4 PASSED: Empty Card và Actions hiển thị chuẩn xác!");

    // ---------------------------------------------------------------------------------
    // TEST 5: Xác nhận KHÔNG CÒN nhãn "PHIÊN BẢN KHUNG CTĐT"
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Kiểm tra tuyệt đối không có nhãn 'PHIÊN BẢN KHUNG CTĐT' ---");
    const fullHtml = await page.content();
    const hasOldLabel = fullHtml.includes("PHIÊN BẢN KHUNG CTĐT") || fullHtml.includes("Phiên bản khung CTĐT");
    if (hasOldLabel) {
      throw new Error("TEST 5 FAILED: Vẫn còn xuất hiện nhãn 'PHIÊN BẢN KHUNG CTĐT' trong giao diện!");
    }
    console.log("✓ TEST 5 PASSED: Đã loại bỏ hoàn toàn 'PHIÊN BẢN KHUNG CTĐT' khỏi UI!");

    // Chuyển lại về HaUI Kỹ thuật máy tính Khóa 20 để chụp screenshot đẹp
    await page.selectOption("#set-select-univ-id", "haui");
    await page.waitForTimeout(500);
    await page.selectOption("#set-select-major-id", "haui_ce");
    await page.waitForTimeout(500);
    await page.selectOption("#set-select-cohort", "20");
    await page.waitForTimeout(500);

    // Capture screenshot proof
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/curriculum_resolution_verified.png" });
    console.log("✓ Đã chụp ảnh curriculum_resolution_verified.png");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST CURRICULUM RESOLUTION ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
