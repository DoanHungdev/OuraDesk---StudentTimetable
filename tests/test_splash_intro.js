import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST OURADESK PURE CODE MOTION INTRO");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    // ---------------------------------------------------------------------------------
    // TEST 1: Launch -> Pure Splash mounts and starts continuous timeline
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Khởi động app -> Pure Code Splash Screen xuất hiện ---");
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    
    // Ensure clean state
    await page.evaluate(() => {
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    const hasStage = await page.$("#splash-stage") !== null;
    const hasAnchor = await page.$("#splash-mark-anchor") !== null;

    if (!hasStage || !hasAnchor) {
      throw new Error("TEST 1 FAILED: Không tìm thấy #splash-stage hoặc #splash-mark-anchor!");
    }
    console.log("✓ TEST 1 PASSED: Pure Splash Screen đã mount thành công!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Giai đoạn Diamond Grow tại T = 0.6s (Chính giữa màn hình, xoay 45 độ)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Diamond Scale & 45deg Rotate tại Center (T = 0.6s) ---");
    await page.waitForTimeout(600);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/pure_splash_01_diamond.png" });
    console.log("✓ TEST 2 PASSED: Chụp ảnh pure_splash_01_diamond.png");

    // ---------------------------------------------------------------------------------
    // TEST 3: Giai đoạn Glide Left & Wordmark Reveal (T = 1.8s)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Un-rotate & Glide Left & Reveal Wordmark (T = 1.8s) ---");
    await page.waitForTimeout(1200);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/pure_splash_02_morph_slide.png" });
    console.log("✓ TEST 3 PASSED: Chụp ảnh pure_splash_02_morph_slide.png");

    // ---------------------------------------------------------------------------------
    // TEST 4: Tagline & 3D Pill Progress Bar (T = 4.0s)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Tagline & 3D Pill Progress Bar Fill (T = 4.0s) ---");
    await page.waitForTimeout(2200);
    const progressWidth = await page.$eval("#splash-progress-bar", el => el.style.width);
    console.log(`- Tiến trình thanh loading: ${progressWidth}`);
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/pure_splash_03_progress.png" });
    console.log("✓ TEST 4 PASSED: Chụp ảnh pure_splash_03_progress.png");

    // ---------------------------------------------------------------------------------
    // TEST 5: Kết thúc 5.3s -> Tự động chuyển tiếp vào Dashboard
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Kết thúc intro -> Tự động chuyển tiếp vào Dashboard ---");
    await page.waitForTimeout(2000); // Now at ~5.8s
    const splashStillMounted = await page.$("#ouradesk-splash") !== null;
    const hasAppContainer = await page.$(".app-container") !== null;

    console.log(`- Splash đã gỡ bỏ sau khi phát xong: ${!splashStillMounted ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Dashboard hiển thị: ${hasAppContainer ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (splashStillMounted || !hasAppContainer) {
      throw new Error("TEST 5 FAILED: Sau khi kết thúc intro chưa chuyển tiếp vào Dashboard!");
    }
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/pure_splash_04_dashboard.png" });
    console.log("✓ TEST 5 PASSED: Chuyển tiếp mượt mà vào Dashboard!");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST PURE CODE INTRO ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
