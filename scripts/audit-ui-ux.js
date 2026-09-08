import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('=== STARTING PLAYWRIGHT COMPREHENSIVE UI/UX AUDIT ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1800, height: 2600 },
    deviceScaleFactor: 2 // High-DPI / Retina for sharp evaluation
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, '../templates/bi-fold.html');
  console.log(`1. Navigating to template: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for Google Fonts to be fully loaded
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  console.log('✓ Fonts loaded and ready in document.');

  // 1. Audit Fonts and Typography
  console.log('\n2. Auditing Typography & Vietnamese Diacritics...');
  const fontAudit = await page.evaluate(() => {
    const fontsUsed = new Set();
    const elements = document.querySelectorAll('h1, h2, h5, h6, p, span, td, th, div');
    elements.forEach(el => {
      const family = window.getComputedStyle(el).fontFamily;
      if (family) fontsUsed.add(family);
    });

    const hasBeVietnamPro = document.fonts.check('16px "Be Vietnam Pro"');
    const hasMontserrat = document.fonts.check('24px "Montserrat"');
    const hasJetBrainsMono = document.fonts.check('12px "JetBrains Mono"');

    return {
      fontFamiliesFound: Array.from(fontsUsed).slice(0, 8),
      checks: {
        beVietnamProLoaded: hasBeVietnamPro,
        montserratLoaded: hasMontserrat,
        jetBrainsMonoLoaded: hasJetBrainsMono
      }
    };
  });
  console.log('Typography Audit Results:', JSON.stringify(fontAudit, null, 2));

  // 2. Audit Color Contrast (WCAG 2.2 AA)
  console.log('\n3. Auditing Color Contrast & Hierarchy...');
  const contrastAudit = await page.evaluate(() => {
    function getLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function parseRgb(colorStr) {
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return [11, 19, 43];
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }

    function getContrast(rgb1, rgb2) {
      const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    const items = [
      { sel: '.cover-headline', bg: [255, 255, 255] },
      { sel: '.cover-subheadline', bg: [255, 255, 255] },
      { sel: '.cover-lead-paragraph', bg: [255, 255, 255] },
      { sel: '.spread-title', bg: [255, 255, 255] },
      { sel: '.zone-heading', bg: [255, 255, 255] },
      { sel: '.table-swiss td', bg: [255, 255, 255] },
      { sel: '.kpi-big', bg: [255, 255, 255] },
      { sel: '.back-masthead-text', bg: [255, 255, 255] }
    ];

    const results = [];
    for (const item of items) {
      const el = document.querySelector(item.sel);
      if (el) {
        const fg = parseRgb(window.getComputedStyle(el).color);
        const ratio = getContrast(fg, item.bg);
        results.push({
          element: item.sel,
          contrastRatio: parseFloat(ratio.toFixed(2)),
          wcagAAPassed: ratio >= 4.5
        });
      }
    }
    return results;
  });
  console.log('Contrast Audit Results:', JSON.stringify(contrastAudit, null, 2));

  // 3. Capture Dedicated Visual Proofs of Each Page
  console.log('\n4. Capturing Individual Page Visual Proofs...');
  fs.mkdirSync(path.resolve(__dirname, '../dist/ui-ux-audit'), { recursive: true });
  const pagesA4 = await page.$$('.page-a4');
  if (pagesA4.length >= 1) {
    await pagesA4[0].screenshot({ path: path.resolve(__dirname, '../dist/ui-ux-audit/01-front-cover.png') });
    console.log('✓ Saved: dist/ui-ux-audit/01-front-cover.png');
  }
  if (pagesA4.length >= 2) {
    await pagesA4[1].screenshot({ path: path.resolve(__dirname, '../dist/ui-ux-audit/02-inside-left.png') });
    console.log('✓ Saved: dist/ui-ux-audit/02-inside-left.png');
  }
  if (pagesA4.length >= 3) {
    await pagesA4[2].screenshot({ path: path.resolve(__dirname, '../dist/ui-ux-audit/03-inside-right.png') });
    console.log('✓ Saved: dist/ui-ux-audit/03-inside-right.png');
  }
  if (pagesA4.length >= 4) {
    await pagesA4[3].screenshot({ path: path.resolve(__dirname, '../dist/ui-ux-audit/04-back-cover.png') });
    console.log('✓ Saved: dist/ui-ux-audit/04-back-cover.png');
  }
  await browser.close();
  console.log('\n=== PLAYWRIGHT UI/UX AUDIT COMPLETED ===');
})();
