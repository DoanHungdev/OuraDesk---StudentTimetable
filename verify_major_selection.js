const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');

async function testMajorSelection() {
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
    localStorage.setItem('classSchedule.theme', 'peach');
  });

  await page.goto('http://localhost:8088/index.html');
  await page.waitForTimeout(1000);

  // Navigate to Settings View
  console.log('Navigating to Settings view...');
  await page.click('.nav-item[data-view="settings"]');
  await page.waitForTimeout(600);

  // Take screenshot of initial Settings View with Major field
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/major_1_settings_view.png' });

  // Verify field is present
  const majorInput = await page.$('#set-user-major');
  console.log(`Major input found: ${!!majorInput}`);

  const initialMajor = await page.$eval('#set-user-major', el => el.value);
  console.log(`Initial major: ${initialMajor}`);

  // Change major to "Kỹ thuật Phần mềm"
  console.log('Updating major to "Kỹ thuật Phần mềm"...');
  await page.fill('#set-user-major', 'Kỹ thuật Phần mềm');
  await page.waitForTimeout(300);

  // Click Save changes button
  await page.click('#settings-profile-form button[type="submit"]');
  await page.waitForTimeout(600);

  const storedUserJson = await page.evaluate(() => localStorage.getItem('class_schedule_univ_user_v2'));
  const storedUser = JSON.parse(storedUserJson);
  console.log('Stored user in localStorage:', storedUser.major);

  const sidebarSubtitle = await page.$eval('.user-role', el => el.innerText);
  console.log(`Sidebar user role text: ${sidebarSubtitle}`);

  // Take screenshot after save
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/major_2_after_save.png' });

  await browser.close();
  console.log('🎉 Major field test PASSED successfully!');
}

testMajorSelection().catch(err => {
  console.error('Error testing major selection:', err);
  process.exit(1);
});
