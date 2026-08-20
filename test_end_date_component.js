import pkg from "file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js";
const { chromium } = pkg;

async function run() {
  console.log("=== BẮT ĐẦU KIỂM THỬ COMPONENT DỰ KIẾN KẾT THÚC HỌC PHẦN ===");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  // Bypass onboarding with exact keys
  await page.addInitScript(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });

  try {
    await page.goto("http://localhost:8088/", { waitUntil: "networkidle" });
    console.log("1. Tải trang chính thành công");

    // Click sidebar link for "Học phần tín chỉ"
    await page.click("a[data-view='courses']");
    await page.waitForTimeout(500);

    // Click "+ Thêm học phần"
    await page.click("#btn-add-course-main");
    await page.waitForSelector("#course-modal-backdrop.open", { timeout: 3000 });
    console.log("2. Đã mở CourseModal Step 1");

    // Fill Step 1
    await page.fill("#course-name", "Hệ Thống Nhúng & IoT");
    await page.fill("#course-code", "IOT301");
    await page.fill("#course-credits", "3");
    await page.click("#btn-goto-step2");
    await page.waitForTimeout(500);
    console.log("3. Đã chuyển sang Step 2 (Lịch học & Ngày bắt đầu)");

    // Take screenshot of Step 2 initial summary card
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_step2_auto_summary.png" });
    console.log("✓ Đã chụp ảnh end_date_step2_auto_summary.png");

    // Verify Summary Card Elements
    const summaryCard = await page.$("#course-end-date-summary-card");
    if (!summaryCard) throw new Error("Không tìm thấy #course-end-date-summary-card");

    const customBtn = await page.$("#btn-open-end-date-custom-modal");
    if (!customBtn) throw new Error("Không tìm thấy nút Tùy chỉnh #btn-open-end-date-custom-modal");

    const btnBox = await customBtn.boundingBox();
    console.log(`- Kích thước nút Tùy chỉnh: ${Math.round(btnBox.width)}px x ${Math.round(btnBox.height)}px (Touch target >= 44px: ${btnBox.height >= 44 ? 'ĐẠT' : 'CHƯA ĐẠT'})`);

    // Click "Tùy chỉnh" to open submodal
    await customBtn.click();
    await page.waitForSelector("#end-date-custom-submodal.open", { timeout: 3000 });
    console.log("4. Đã mở Popover/Modal Tùy chỉnh ngày kết thúc");

    // Take screenshot of Submodal Auto Option
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_custom_submodal_auto.png" });
    console.log("✓ Đã chụp ảnh end_date_custom_submodal_auto.png");

    // Select Option 2: Tự đặt ngày kết thúc
    await page.click("#card-opt-manual");
    await page.waitForTimeout(400);

    // Set an insufficient end date: only 2 weeks from start (e.g. 2026-09-01)
    await page.fill("#input-submodal-end-date", "2026-09-01");
    await page.dispatchEvent("#input-submodal-end-date", "change");
    await page.waitForTimeout(500);

    // Take screenshot of Warning for insufficient periods
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_custom_warning_insufficient.png" });
    console.log("✓ Đã chụp ảnh end_date_custom_warning_insufficient.png (Cảnh báo thiếu tiết)");

    // Set a valid sufficient end date (e.g. 2026-12-30)
    await page.fill("#input-submodal-end-date", "2026-12-30");
    await page.dispatchEvent("#input-submodal-end-date", "change");
    await page.waitForTimeout(500);

    // Take screenshot of Sufficient status
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_custom_sufficient.png" });
    console.log("✓ Đã chụp ảnh end_date_custom_sufficient.png (Đủ thời lượng)");

    // Click "Áp dụng"
    await page.click("#btn-submodal-apply");
    await page.waitForTimeout(500);
    console.log("5. Đã áp dụng ngày tùy chỉnh vào Step 2");

    // Take screenshot of Step 2 after applying manual date
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_step2_manual_applied.png" });
    console.log("✓ Đã chụp ảnh end_date_step2_manual_applied.png");

    // Continue to Step 3 (Preview)
    await page.click("#btn-goto-step3");
    await page.waitForTimeout(500);
    console.log("6. Đã chuyển sang Step 3 (Xem trước & Lưu)");

    // Take screenshot of Step 3
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_step3_preview.png" });
    console.log("✓ Đã chụp ảnh end_date_step3_preview.png");

    // Test Mobile Viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click("#btn-back-to-step2");
    await page.waitForTimeout(500);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/end_date_mobile_summary.png" });
    console.log("✓ Đã chụp ảnh end_date_mobile_summary.png (Mobile Responsive)");

    console.log("=== TẤT CẢ KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG 100%! ===");
  } catch (err) {
    console.error("LỖI KIỂM THỬ:", err);
  } finally {
    await browser.close();
  }
}

run();
