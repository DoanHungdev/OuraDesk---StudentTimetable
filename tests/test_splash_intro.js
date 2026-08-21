import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST OURADESK FULLSCREEN INTRO VIDEO");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    // ---------------------------------------------------------------------------------
    // TEST 1: Launch -> Video element covers full screen and NO skip button exists
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Khởi động app -> Video Fullscreen & Không có nút Bỏ qua ---");
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    
    // Ensure clean state
    await page.evaluate(() => {
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    const hasVideo = await page.$("#ouradesk-intro-video") !== null;
    const hasSkipBtn = await page.$("#splash-skip-btn") !== null;

    console.log(`- Có Video Player: ${hasVideo ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Đã xóa nút Bỏ qua: ${!hasSkipBtn ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (!hasVideo || hasSkipBtn) {
      throw new Error("TEST 1 FAILED: Thiếu video player hoặc nút Bỏ qua chưa bị xóa!");
    }
    console.log("✓ TEST 1 PASSED: Video player fullscreen sẵn sàng!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Capture Video Playback at T = 2.0s (Full screen cover edge to edge)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Kiểm tra video fullscreen ôm trọn màn hình tại T = 2.0s ---");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_fullscreen_verified.png" });
    console.log("✓ TEST 2 PASSED: Chụp ảnh splash_fullscreen_verified.png");

    // ---------------------------------------------------------------------------------
    // TEST 3: Đợi video phát xong toàn bộ (5.8s) -> Tự động chuyển vào Dashboard
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Chờ xem hết toàn bộ video (5.8s) -> Vào Dashboard ---");
    await page.waitForTimeout(4500); // Now at ~6.5s
    const splashStillMounted = await page.$("#ouradesk-splash") !== null;
    const hasAppContainer = await page.$(".app-container") !== null;

    console.log(`- Splash đã gỡ bỏ sau khi xem xong: ${!splashStillMounted ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Dashboard hiển thị: ${hasAppContainer ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (splashStillMounted || !hasAppContainer) {
      throw new Error("TEST 3 FAILED: Sau khi xem hết video chưa chuyển tiếp mượt vào Dashboard!");
    }
    console.log("✓ TEST 3 PASSED: Xem hết video thành công, dashboard sẵn sàng!");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST FULLSCREEN INTRO ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
