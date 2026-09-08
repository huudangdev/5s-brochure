// Script to export A4 Bi-fold (Seamless A3 Inside Spread) and Tri-fold templates to Print PDF
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function renderPdf(htmlFileName, pdfFileName, options = {}) {
  const filePath = path.join(rootDir, 'templates', htmlFileName);
  const outputPath = path.join(distDir, pdfFileName);

  console.log(`Rendering ${htmlFileName} -> ${pdfFileName}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

  await page.pdf({
    path: outputPath,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    ...options
  });

  await browser.close();
  console.log(`✓ Successfully generated: ${outputPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const doBifold = args.includes('--bifold') || args.length === 0;
  const doTrifold = args.includes('--trifold') || args.length === 0;

  if (doBifold) {
    await renderPdf('bi-fold.html', '5S-Brochure-BiFold-A4.pdf');
  }
  if (doTrifold) {
    await renderPdf('tri-fold.html', '5S-Brochure-TriFold-A4.pdf', {
      landscape: true
    });
  }
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
