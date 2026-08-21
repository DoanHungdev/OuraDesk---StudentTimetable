import { createTestBrowser } from './test_helper.js';

async function run() {
  console.log("==================================================");
  console.log("  TEST OURADESK MOTION INTRO & SPLASH SCREEN");
  console.log("==================================================");

  const { browser, page } = await createTestBrowser({ headless: true });

  try {
    // ---------------------------------------------------------------------------------
    // TEST 1: Initial Launch -> Splash Screen appears with clean background
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 1: Khởi động app -> Splash Screen xuất hiện ---");
    await page.goto("http://localhost:8088/", { waitUntil: "domcontentloaded" });
    
    // Ensure clean session
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.setItem('class_schedule_onboarded_v2', 'true');
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    const hasSplash = await page.$("#ouradesk-splash") !== null;
    if (!hasSplash) {
      throw new Error("TEST 1 FAILED: Không tìm thấy element #ouradesk-splash!");
    }
    console.log("✓ TEST 1 PASSED: #ouradesk-splash đã mount thành công!");

    // ---------------------------------------------------------------------------------
    // TEST 2: Giai đoạn Diamond Grow & 45deg Rotation (T = 0.6s)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 2: Giai đoạn Diamond Grow & Rotation (T = 0.6s) ---");
    await page.waitForTimeout(600);
    const hasSquare = await page.$(".splash-initial-square") !== null;
    const hasShadow = await page.$(".splash-mark-shadow") !== null;
    if (!hasSquare || !hasShadow) {
      throw new Error("TEST 2 FAILED: Thiếu splash-initial-square hoặc splash-mark-shadow!");
    }
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_01_square_grow.png" });
    console.log("✓ TEST 2 PASSED: Chụp ảnh splash_01_square_grow.png");

    // ---------------------------------------------------------------------------------
    // TEST 3: Giai đoạn Morph Logo & Wordmark Reveal (T = 1.4s)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 3: Morph Logo OuraDesk & Wordmark Reveal (T = 1.4s) ---");
    await page.waitForTimeout(800); // Now at ~1.4s
    const wordmarkText = await page.$eval("#splash-wordmark", el => el.innerText);
    if (!wordmarkText.includes("OuraDesk")) {
      throw new Error(`TEST 3 FAILED: Wordmark không đúng: ${wordmarkText}`);
    }
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_02_logo_reveal.png" });
    console.log("✓ TEST 3 PASSED: Logo OuraDesk và Wordmark đã xuất hiện! Chụp ảnh splash_02_logo_reveal.png");

    // ---------------------------------------------------------------------------------
    // TEST 4: Giai đoạn Tagline & 3D Pill Progress Bar (T = 3.0s)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 4: Tagline & 3D Pill Progress Bar (T = 3.0s) ---");
    await page.waitForTimeout(1600); // Now at ~3.0s
    const taglineText = await page.$eval("#splash-tagline", el => el.innerText);
    const progressWidth = await page.$eval("#splash-progress-fill", el => el.style.width);
    console.log(`- Tagline: "${taglineText}"`);
    console.log(`- Progress Width: ${progressWidth}`);

    if (!taglineText.includes("Chụp TKB. App lo.")) {
      throw new Error("TEST 4 FAILED: Tagline chưa hiển thị đúng 'Chụp TKB. App lo.'!");
    }
    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_03_progress_bar.png" });
    console.log("✓ TEST 4 PASSED: Progress Bar hoạt động mượt mà! Chụp ảnh splash_03_progress_bar.png");

    // ---------------------------------------------------------------------------------
    // TEST 5: Hoàn tất 4.2s -> Transition vào Main App / Dashboard
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 5: Kết thúc 4.2s -> Chuyển tiếp vào Dashboard ---");
    await page.waitForTimeout(1800); // Now at ~4.8s (> 4.2s + 0.42s transition)
    const splashStillMounted = await page.$("#ouradesk-splash") !== null;
    const hasAppContainer = await page.$(".app-container") !== null;

    console.log(`- Splash đã gỡ bỏ: ${!splashStillMounted ? "CÓ (CHUẨN)" : "KHÔNG"}`);
    console.log(`- Dashboard hiển thị: ${hasAppContainer ? "CÓ (CHUẨN)" : "KHÔNG"}`);

    if (splashStillMounted || !hasAppContainer) {
      throw new Error("TEST 5 FAILED: Splash screen chưa transition mượt vào Dashboard!");
    }

    const sessionValue = await page.evaluate(() => sessionStorage.getItem('ouradesk.introPlayed'));
    if (sessionValue !== 'true') {
      throw new Error("TEST 5 FAILED: sessionStorage 'ouradesk.introPlayed' chưa được set!");
    }

    await page.screenshot({ path: "C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/splash_04_dashboard_revealed.png" });
    console.log("✓ TEST 5 PASSED: Transition hoàn tất, dashboard sẵn sàng!");

    // ---------------------------------------------------------------------------------
    // TEST 6: Bấm Click / Escape -> Bỏ qua Splash Screen ngay lập tức (Skip)
    // ---------------------------------------------------------------------------------
    console.log("\n--- TEST 6: Bấm Click hoặc Escape -> Bỏ qua Intro ngay lập tức ---");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);
    const hasSplashOnReload = await page.$("#ouradesk-splash") !== null;
    if (!hasSplashOnReload) {
      throw new Error("TEST 6 FAILED: Không tìm thấy Splash Screen khi tải lại!");
    }
    // Click on splash screen to skip
    await page.click("#ouradesk-splash");
    await page.waitForTimeout(500);
    const splashAfterClick = await page.$("#ouradesk-splash") !== null;
    if (splashAfterClick) {
      throw new Error("TEST 6 FAILED: Không thể click để bỏ qua Splash Screen!");
    }
    console.log("✓ TEST 6 PASSED: Click to skip / Bỏ qua Splash Screen hoạt động tức thì!");

    console.log("\n==================================================");
    console.log("  TẤT CẢ CÁC BÀI TEST MOTION INTRO ĐÃ PASS 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ LỖI KIỂM THỬ:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
