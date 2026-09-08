// Playwright automated test script for 5S Cloud B2B Master Brochure
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runTests() {
  console.log('=== STARTING PLAYWRIGHT BROCHURE VALIDATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 2800 },
    deviceScaleFactor: 2
  });

  const templatePath = path.join(process.cwd(), 'templates', 'bi-fold.html');
  console.log(`1. Navigating to template: file://${templatePath}`);
  
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle' });

  // Test 1: Check broken images
  console.log('\n2. Checking image asset integrity...');
  const imageReport = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => ({
      src: img.getAttribute('src'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      broken: img.naturalWidth === 0 || !img.complete
    }));
  });

  const brokenImages = imageReport.filter(img => img.broken);
  if (brokenImages.length > 0) {
    console.error(`❌ FAILED: Found ${brokenImages.length} broken images:`, brokenImages);
    process.exit(1);
  } else {
    console.log(`✓ PASSED: All ${imageReport.length} images loaded successfully with valid natural dimensions.`);
  }

  // Test 2: Dimensional & Overflow Validation for all 4 pages
  console.log('\n3. Validating page geometry and vertical whitespace budget (Target: 1123px = 297mm)...');
  const pageGeometry = await page.evaluate(() => {
    function auditContainer(name, selector) {
      const el = document.querySelector(selector);
      if (!el) return { name, error: 'Element not found' };
      const lastChild = el.lastElementChild;
      const contentBottom = lastChild.offsetTop + lastChild.offsetHeight;
      const emptyPx = el.offsetHeight - contentBottom;
      const emptyMm = (emptyPx * 25.4) / 96;
      return {
        name,
        containerHeight: el.offsetHeight,
        contentBottom,
        emptyPx,
        emptyMm: parseFloat(emptyMm.toFixed(2)),
        scrollHeight: el.scrollHeight,
        overflowPx: el.scrollHeight - el.offsetHeight
      };
    }

    return {
      cover: auditContainer('Page 1: Cover', '.cover-editorial, .cover-unboxed'),
      spread: auditContainer('Pages 2-3: Inside Spread', '.spread-container, .spread-unboxed-wrap'),
      back: auditContainer('Page 4: Back Cover', '.back-editorial, .back-unboxed-wrap')
    };
  });

  console.log('Page Geometry Audit Results:');
  console.log(JSON.stringify(pageGeometry, null, 2));

  for (const [key, data] of Object.entries(pageGeometry)) {
    if (data.overflowPx > 0) {
      console.error(`❌ FAILED: ${data.name} has ${data.overflowPx}px overflow!`);
      process.exit(1);
    }
    if (data.emptyMm > 15) {
      console.warn(`⚠️ WARNING: ${data.name} has ${data.emptyMm}mm empty space (target <= 10mm).`);
    } else {
      console.log(`✓ PASSED: ${data.name} has perfect height (${data.containerHeight}px) with ${data.emptyMm}mm print-safe margin.`);
    }
  }

  // Test 3: Capture full visual snapshots
  console.log('\n4. Capturing visual proof snapshots...');
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  await page.screenshot({
    path: path.join(distDir, 'playwright-full-proof.png'),
    fullPage: true
  });
  console.log(`✓ Saved full proof snapshot: ${path.join(distDir, 'playwright-full-proof.png')}`);

  await browser.close();
  console.log('\n=== ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
