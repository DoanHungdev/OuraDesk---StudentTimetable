const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');
const path = require('path');

async function test() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const artifactDir = 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb';

  // 1. Desktop 1920x1080 (Weekly Timetable)
  const contextDesktop = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(500);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'desktop_1920_timetable.png') });
  console.log('✅ Captured desktop 1920x1080');

  // 2. Dashboard View
  await pageDesktop.click('[data-view="dashboard"]');
  await pageDesktop.waitForTimeout(400);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'desktop_dashboard.png') });
  console.log('✅ Captured dashboard view');

  // 3. Courses View
  await pageDesktop.click('[data-view="courses"]');
  await pageDesktop.waitForTimeout(400);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'desktop_courses.png') });
  console.log('✅ Captured courses view');

  // 4. Statistics View
  await pageDesktop.click('[data-view="statistics"]');
  await pageDesktop.waitForTimeout(400);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'desktop_statistics.png') });
  console.log('✅ Captured statistics view');

  // 5. Auto-Scheduler Modal
  await pageDesktop.click('[data-view="timetable"]');
  await pageDesktop.waitForTimeout(300);
  await pageDesktop.click('#header-auto-sched-btn');
  await pageDesktop.waitForTimeout(400);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'desktop_auto_scheduler.png') });
  console.log('✅ Captured auto scheduler modal');
  await pageDesktop.click('#btn-cancel-auto-sched');

  // 6. Mobile 390x844 (iPhone 14)
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(400);
  await pageMobile.screenshot({ path: path.join(artifactDir, 'mobile_390_day_view.png') });
  console.log('✅ Captured mobile 390x844 day view');

  // 7. Tablet 1024x768
  const contextTablet = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://localhost:8088/index.html', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(400);
  await pageTablet.screenshot({ path: path.join(artifactDir, 'tablet_1024.png') });
  console.log('✅ Captured tablet 1024x768');

  await browser.close();
  console.log('🎉 All screenshots captured successfully!');
}

test().catch(e => console.error('Error capturing screenshots:', e));
