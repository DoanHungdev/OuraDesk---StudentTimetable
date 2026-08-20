import fs from 'fs';
import path from 'path';

/**
 * Portable Playwright & Chromium Loader
 * Detects installed browser and playwright package dynamically without hardcoding user paths
 */
export async function getPlaywright() {
  // 1. Try standard require / import
  try {
    const playwright = await import('playwright');
    return playwright.chromium || playwright.default?.chromium;
  } catch (e) {
    // 2. Try common local tool paths via process.env
    const appData = process.env.LOCALAPPDATA || '';
    const candidates = [
      path.join(appData, 'ms-playwright-go', '1.57.0', 'package', 'index.js'),
      path.join(appData, 'ms-playwright', 'package', 'index.js')
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        const fileUrl = 'file:///' + cand.replace(/\\/g, '/');
        const pkg = await import(fileUrl);
        return pkg.chromium || pkg.default?.chromium;
      }
    }
  }

  throw new Error('Playwright not found in environment');
}

export function getBrowserPath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const standardPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  for (const p of standardPaths) {
    if (fs.existsSync(p)) return p;
  }

  return undefined;
}

export async function createTestBrowser(options = {}) {
  const chromium = await getPlaywright();
  const executablePath = getBrowserPath();

  const launchOpts = {
    headless: options.headless !== undefined ? options.headless : true,
    ...options
  };

  if (executablePath) {
    launchOpts.executablePath = executablePath;
  }

  const browser = await chromium.launch(launchOpts);
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1360, height: 850 }
  });
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  return { browser, context, page };
}
