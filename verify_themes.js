const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb';

async function run() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1540, height: 920 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  // Reset and seed state
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
    localStorage.setItem('classSchedule.theme', 'peach');
  });

  console.log('Navigating to http://localhost:8088/index.html...');
  await page.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Theme 1: Peach Glass Dashboard & Timetable
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_1_peach_dashboard.png'), fullPage: true });
  console.log('✅ Captured theme_1_peach_dashboard.png');

  // Go to Settings to view Appearance section
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_settings_appearance.png'), fullPage: true });
  console.log('✅ Captured theme_settings_appearance.png');

  // 2. Switch to Ocean Glass in real-time
  await page.click('.theme-card[data-theme-id="ocean"]');
  await page.waitForTimeout(300);
  await page.click('a[data-view="dashboard"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_2_ocean_dashboard.png'), fullPage: true });
  console.log('✅ Captured theme_2_ocean_dashboard.png');

  // 3. Switch to Lavender Dream
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(300);
  await page.click('.theme-card[data-theme-id="lavender"]');
  await page.waitForTimeout(300);
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_3_lavender_timetable.png'), fullPage: true });
  console.log('✅ Captured theme_3_lavender_timetable.png');

  // 4. Switch to Mint Campus
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(300);
  await page.click('.theme-card[data-theme-id="mint"]');
  await page.waitForTimeout(300);
  await page.click('a[data-view="dashboard"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_4_mint_dashboard.png'), fullPage: true });
  console.log('✅ Captured theme_4_mint_dashboard.png');

  // 5. Switch to Midnight Glass (Dark Mode)
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(300);
  await page.click('.theme-card[data-theme-id="midnight"]');
  await page.waitForTimeout(300);
  await page.click('a[data-view="dashboard"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_5_midnight_dashboard.png'), fullPage: true });
  console.log('✅ Captured theme_5_midnight_dashboard.png');

  // Midnight Timetable & Modal test
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_5_midnight_timetable.png'), fullPage: true });
  console.log('✅ Captured theme_5_midnight_timetable.png');

  // 6. Switch to Sakura
  await page.click('a[data-view="settings"]');
  await page.waitForTimeout(300);
  await page.click('.theme-card[data-theme-id="sakura"]');
  await page.waitForTimeout(300);
  await page.click('a[data-view="dashboard"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_6_sakura_dashboard.png'), fullPage: true });
  console.log('✅ Captured theme_6_sakura_dashboard.png');

  // 7. Mobile View (2 columns theme picker)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('classSchedule.theme', 'ocean');
  });
  await mobilePage.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);
  await mobilePage.click('button[data-view="settings"]');
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_mobile_settings.png') });
  console.log('✅ Captured theme_mobile_settings.png');

  await browser.close();
  console.log('🎉 All 6 Themes verification tests and screenshots completed successfully!');
}

run().catch(err => {
  console.error('Error verifying themes:', err);
  process.exit(1);
});
