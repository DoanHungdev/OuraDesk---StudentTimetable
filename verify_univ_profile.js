const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb';

async function run() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8088/index.html...');
  await page.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Capture Main Timetable with Dual Period Axis
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_timetable_periods.png'), fullPage: true });
  console.log('✅ Captured desktop_timetable_periods.png');

  // 2. Open University Profile Modal and Capture
  await page.click('#header-univ-badge-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_univ_profile_modal.png'), fullPage: true });
  console.log('✅ Captured desktop_univ_profile_modal.png');

  // Close modal
  await page.click('#univ-profile-close-x');
  await page.waitForTimeout(300);

  // 3. Open Add Course Modal and test period calculations
  await page.click('#header-add-course-btn');
  await page.waitForTimeout(500);

  // Verify initial calculation (Tiết 1 -> 3)
  const calcText = await page.innerText('#calc-time-range-txt');
  console.log('Calculated time range for Period 1 -> 3:', calcText);

  // Switch to Period 4 -> 5
  await page.selectOption('#sch-start-period', '4');
  await page.selectOption('#sch-end-period', '5');
  await page.waitForTimeout(300);
  const calcText2 = await page.innerText('#calc-time-range-txt');
  console.log('Calculated time range for Period 4 -> 5:', calcText2);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_add_course_periods.png'), fullPage: true });
  console.log('✅ Captured desktop_add_course_periods.png');

  // Close course modal
  await page.click('#modal-close-x');
  await page.waitForTimeout(300);

  // 4. Mobile Viewport (iPhone 14)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_390_periods.png') });
  console.log('✅ Captured mobile_390_periods.png');

  await browser.close();
  console.log('🎉 Verification completed successfully!');
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
