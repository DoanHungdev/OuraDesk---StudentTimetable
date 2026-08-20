const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');

async function verifyFixes() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'midnight');
  });

  console.log('Testing fixes on http://localhost:8088/index.html...');
  await page.goto('http://localhost:8088/index.html');
  await page.waitForTimeout(1000);

  // 1. Navigate to Settings (Cài đặt & Khung giờ)
  console.log('1. Testing Settings & University Time Profile...');
  await page.click('.nav-item[data-view="settings"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/fix_7_university_time_profile_settings.png' });
  console.log('✅ Captured fix_7_university_time_profile_settings.png');

  // 2. Open University Profile Modal
  console.log('2. Opening University Profile Modal...');
  await page.click('#btn-set-open-univ-profile');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/fix_8_university_profile_modal.png' });
  console.log('✅ Captured fix_8_university_profile_modal.png');

  // 3. Switch to HUST in Modal to test dynamic switching
  console.log('3. Selecting Bách Khoa Hà Nội (HUST)...');
  await page.selectOption('#select-univ-id', 'hust');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/fix_9_hust_profile_modal.png' });
  console.log('✅ Captured fix_9_hust_profile_modal.png');

  // Apply HUST profile
  await page.click('#univ-profile-save-btn');
  await page.waitForTimeout(600);

  // Take screenshot of settings after HUST applied
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/fix_10_settings_after_hust_applied.png' });
  console.log('✅ Captured fix_10_settings_after_hust_applied.png');

  await browser.close();
  console.log('🎉 All University Time Profile tests completed successfully!');
}

verifyFixes().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
