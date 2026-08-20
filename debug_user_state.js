import pkg from 'file:///C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package/index.js';
const { chromium } = pkg;

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message, err.stack));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  await page.goto('http://127.0.0.1:8088/');
  await page.waitForTimeout(1000);

  // Click on timetable view
  console.log('Clicking on timetable...');
  await page.click('a[data-view="timetable"]');
  await page.waitForTimeout(1000);

  const html = await page.evaluate(() => document.getElementById('view-slot')?.innerHTML);
  console.log('view-slot innerHTML length:', html ? html.length : 0);

  await browser.close();
})();
