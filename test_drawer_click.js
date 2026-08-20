import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\admin\\.gemini\\antigravity\\brain\\374e7888-a9e1-40be-9088-41c689fb2ecb';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:8088/');
  await page.evaluate(() => {
    localStorage.setItem('class_schedule_onboarded_v2', 'true');
    localStorage.setItem('class_schedule_mode_v2', 'university');
  });
  await page.reload();
  await page.waitForTimeout(1000);

  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(600);

  // Click first card
  const firstCard = await page.$('.course-card-block');
  console.log('firstCard found:', !!firstCard);
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_drawer_live.png') });
  console.log('Saved test_drawer_live.png');
  await browser.close();
})();
