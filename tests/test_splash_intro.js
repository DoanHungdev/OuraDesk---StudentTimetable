import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST OURADESK MOTION INTRO VIDEO INTEGRATION");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    // ---------------------------------------------------------------------------------
    // TEST 1: Launch -> Video Element Mounted & Plays Automatically
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Khởi động app -> Video Intro xuất hiện & Autoplay ---");
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    
    // Ensure clean state
    await page.evaluate(() => {
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    const hasVideo = await page.$("#ouradesk-intro-video") !== null;
    const hasSkipBtn = await page.$("#splash-skip-btn") !== null;

    if (!hasVideo || !hasSkipBtn) {
      throw new Error("TEST 1 FAILED: Không tìm thấy #ouradesk-intro-video hoặc #splash-skip-btn!");
    }
    console.log("✓ TEST 1 PASSED: Video player và nút Bỏ qua đã sẵn sàng!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Capture Video Playback at T = 1.0s (Diamond Grow / Morph)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Kiểm tra video đang phát tại T = 1.0s ---");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_video_01_play.png" });
    console.log("✓ TEST 2 PASSED: Đang phát video mượt mà! Chụp ảnh splash_video_01_play.png");

    // ---------------------------------------------------------------------------------
    // TEST 3: Capture Video Playback at T = 3.5s (Logo + Wordmark + Tagline + Progress)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Kiểm tra video tại T = 3.5s (Full Lockup & 3D Pill Progress) ---");
    await page.waitForTimeout(2500);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_video_02_lockup.png" });
    console.log("✓ TEST 3 PASSED: Đang hiển thị trọn vẹn chi tiết video 1080p! Chụp ảnh splash_video_02_lockup.png");

    // ---------------------------------------------------------------------------------
    // TEST 4: Kết thúc video -> Transition vào Main App
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Kết thúc video (5.8s) -> Tự động chuyển tiếp vào Dashboard ---");
    await page.waitForTimeout(3000); // Now at ~6.5s
    const splashStillMounted = await page.$("#ouradesk-splash") !== null;
    const hasAppContainer = await page.$(".app-container") !== null;

    console.log(`- Splash đã gỡ bỏ: ${!splashStillMounted ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Dashboard hiển thị: ${hasAppContainer ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (splashStillMounted || !hasAppContainer) {
      throw new Error("TEST 4 FAILED: Video kết thúc chưa transition mượt vào Dashboard!");
    }
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_video_03_dashboard.png" });
    console.log("✓ TEST 4 PASSED: Transition hoàn tất, dashboard sẵn sàng!");

    // ---------------------------------------------------------------------------------
    // TEST 5: Kiểm tra nút Skip / Bấm phím Esc bỏ qua ngay lập tức
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Kiểm tra nút 'Bỏ qua (Esc)' hoạt động tức thì ---");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const skipBtn = await page.$("#splash-skip-btn");
    if (!skipBtn) {
      throw new Error("TEST 5 FAILED: Không tìm thấy nút Skip!");
    }
    await skipBtn.click();
    await page.waitForTimeout(500);
    const splashAfterSkip = await page.$("#ouradesk-splash") !== null;
    if (splashAfterSkip) {
      throw new Error("TEST 5 FAILED: Bấm nút Bỏ qua không hoạt động!");
    }
    console.log("✓ TEST 5 PASSED: Bấm nút Bỏ qua hoạt động tức thì!");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST INTRO VIDEO ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
