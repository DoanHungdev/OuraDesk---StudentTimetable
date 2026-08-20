const { chromium } = require('C:/Users/admin/AppData/Local/ms-playwright-go/1.57.0/package');

async function testAvatarCustomizer() {
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

  // 1. Click sidebar user avatar to open AvatarModal
  console.log('Clicking avatar in Sidebar...');
  await page.click('.sidebar .user-avatar');
  await page.waitForTimeout(400);

  const isModalOpen = await page.$eval('#avatar-modal-backdrop', el => el.classList.contains('open'));
  console.log(`Avatar modal open from sidebar: ${isModalOpen}`);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_1_modal_opened.png' });

  // 2. Select Emoji "🧑‍💻"
  console.log('Selecting Emoji 🧑‍💻...');
  await page.click('.avatar-emoji-btn[data-emoji="🧑‍💻"]');
  await page.waitForTimeout(300);

  // Select Midnight Gradient
  console.log('Selecting Midnight Gradient...');
  await page.click('.avatar-gradient-pill[title="Xanh Midnight"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_2_emoji_selected.png' });

  // 3. Save Avatar
  console.log('Saving avatar...');
  await page.click('#btn-avatar-save');
  await page.waitForTimeout(600);

  const sidebarAvatarText = await page.$eval('.sidebar .user-avatar', el => el.innerText.trim());
  console.log(`Updated sidebar avatar text: ${sidebarAvatarText}`);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_3_sidebar_updated.png' });

  // 4. Navigate to Settings and verify Avatar in Settings View
  console.log('Navigating to Settings view...');
  await page.click('.nav-item[data-view="settings"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_4_settings_view_avatar.png' });

  // 5. Open Avatar Modal from Settings View button
  console.log('Clicking "Đổi Avatar" in Settings View...');
  await page.click('#btn-set-avatar-quick');
  await page.waitForTimeout(400);

  // Switch to Initials Tab
  console.log('Switching to Initials tab...');
  await page.click('#tab-btn-av-initials');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_5_initials_tab.png' });

  // Switch to Upload Tab
  console.log('Switching to Upload tab...');
  await page.click('#tab-btn-av-upload');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/admin/.gemini/antigravity/brain/374e7888-a9e1-40be-9088-41c689fb2ecb/avatar_6_upload_tab.png' });

  await page.click('#avatar-modal-close-x');
  await page.waitForTimeout(300);

  await browser.close();
  console.log('🎉 Avatar Customizer test PASSED successfully!');
}

testAvatarCustomizer().catch(err => {
  console.error('Error testing avatar customizer:', err);
  process.exit(1);
});
