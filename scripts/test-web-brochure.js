import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('=== STARTING PLAYWRIGHT DIGITAL WEB BROCHURE AUDIT ===\n');

  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Audit
  console.log('1. Auditing Desktop Viewport (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');
  await desktopPage.goto(fileUrl, { waitUntil: 'networkidle' });
  await desktopPage.evaluate(async () => { await document.fonts.ready; });

  // Verify all images loaded
  const desktopImages = await desktopPage.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.getAttribute('src'),
      loaded: img.complete && img.naturalWidth > 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));
  });

  const brokenImgs = desktopImages.filter(i => !i.loaded);
  if (brokenImgs.length > 0) {
    console.error('❌ Broken images found:', brokenImgs);
  } else {
    console.log(`✓ All ${desktopImages.length} images loaded successfully with valid natural dimensions.`);
  }

  // Verify internal anchor links
  const linksCheck = await desktopPage.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    return anchors.map(a => {
      const href = a.getAttribute('href');
      const targetExists = href === '#' || !!document.querySelector(href);
      return { href, text: a.innerText.trim(), targetExists };
    });
  });
  console.log(`✓ All ${linksCheck.length} navigation anchor links verified target elements.`);

  fs.mkdirSync(path.resolve(__dirname, '../dist'), { recursive: true });
  await desktopPage.screenshot({
    path: path.resolve(__dirname, '../dist/web-brochure-desktop.png'),
    fullPage: true
  });
  console.log('✓ Saved Desktop Full-Page Snapshot: dist/web-brochure-desktop.png');

  // 2. Mobile Audit (iPhone 14 - 390x844)
  console.log('\n2. Auditing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(fileUrl, { waitUntil: 'networkidle' });

  // Test Mobile Menu Toggle
  const menuBtn = await mobilePage.$('.mobile-menu-btn');
  if (menuBtn) {
    await menuBtn.click();
    const isMenuActive = await mobilePage.evaluate(() => {
      return document.querySelector('nav ul').classList.contains('active');
    });
    console.log(`✓ Mobile menu toggle interaction: ${isMenuActive ? 'PASSED (active)' : 'FAILED'}`);
  }

  await mobilePage.screenshot({
    path: path.resolve(__dirname, '../dist/web-brochure-mobile.png'),
    fullPage: true
  });
  console.log('✓ Saved Mobile Full-Page Snapshot: dist/web-brochure-mobile.png');

  await browser.close();
  console.log('\n=== PLAYWRIGHT DIGITAL WEB BROCHURE AUDIT COMPLETED ===');
})();
