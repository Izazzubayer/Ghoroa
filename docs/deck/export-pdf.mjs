#!/usr/bin/env node
/**
 * Export deck.html → multi-page PDF that matches on-screen HTML.
 *
 * Capture: 1512×982 CSS px (16:10 laptop view), 2× sharpness.
 * PDF page size: real landscape inches (not raw CSS px-as-points —
 * 1512pt ≈ 21" wide and many viewers letterbox that into a white
 * portrait frame). Tall slides grow in height only.
 */
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const input = resolve(__dirname, process.argv[2] || 'deck.html');
const output = resolve(__dirname, process.argv[3] || 'Ghoroa_Proposal.pdf');

/** CSS viewport — matches browsing the deck on a laptop */
const WIDTH = 1512;
const VIEWPORT_HEIGHT = 982; // 16:10
const SCALE = 2;

/** PDF page width in inches (standard widescreen slide). Height follows aspect. */
const PDF_WIDTH_IN = 13.333; // ~1920px @ 144dpi presentation width
const PT = 72;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({
    width: WIDTH,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: SCALE,
  });
  await page.goto(pathToFileURL(input).href, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));

  await page.addStyleTag({
    content: `
      html, body {
        scroll-snap-type: none !important;
        overflow: hidden !important;
        height: auto !important;
        margin: 0 !important;
        background: #1a120c !important;
      }
      .progress, .nav-dots { display: none !important; }
      .reveal {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .slide {
        position: relative !important;
        width: ${WIDTH}px !important;
        min-height: 0 !important;
        height: auto !important;
        max-height: none !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
    `,
  });

  const slideCount = await page.$$eval('.slide', (els) => els.length);
  console.log(`Measuring ${slideCount} slides @ ${WIDTH}×${VIEWPORT_HEIGHT} (16:10), ${SCALE}×…`);

  const contentHeights = await page.$$eval('.slide', (els) =>
    els.map((el) => {
      el.style.minHeight = '0';
      el.style.height = 'auto';
      return Math.ceil(el.scrollHeight);
    })
  );

  const pageHeights = contentHeights.map((h) => Math.max(VIEWPORT_HEIGHT, h));
  pageHeights.forEach((h, i) => {
    const pdfH = PDF_WIDTH_IN * (h / WIDTH);
    const mode = h > VIEWPORT_HEIGHT ? 'tall' : 'viewport';
    console.log(
      `  slide ${String(i + 1).padStart(2, '0')}: capture ${WIDTH}×${h} → PDF ${PDF_WIDTH_IN.toFixed(2)}"×${pdfH.toFixed(2)}" (${mode})`
    );
  });

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < slideCount; i++) {
    const height = pageHeights[i];

    await page.setViewport({
      width: WIDTH,
      height,
      deviceScaleFactor: SCALE,
    });

    await page.evaluate(
      ({ index, width, height }) => {
        document.documentElement.style.height = `${height}px`;
        document.body.style.height = `${height}px`;
        document.body.style.margin = '0';
        document.querySelectorAll('.slide').forEach((el, idx) => {
          if (idx === index) {
            el.style.display = 'flex';
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.minHeight = `${height}px`;
            el.style.maxHeight = `${height}px`;
          } else {
            el.style.display = 'none';
          }
        });
        window.scrollTo(0, 0);
      },
      { index: i, width: WIDTH, height }
    );

    await new Promise((r) => setTimeout(r, 100));

    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: WIDTH, height },
      captureBeyondViewport: true,
    });

    const image = await pdfDoc.embedPng(png);
    const pdfW = PDF_WIDTH_IN * PT;
    const pdfH = PDF_WIDTH_IN * (height / WIDTH) * PT;
    const pdfPage = pdfDoc.addPage([pdfW, pdfH]);
    pdfPage.drawImage(image, {
      x: 0,
      y: 0,
      width: pdfW,
      height: pdfH,
    });
  }

  const bytes = await pdfDoc.save();
  await writeFile(output, bytes);
  console.log(`Saved → ${output}`);
  console.log(
    `Format: 16:10 landscape (~${PDF_WIDTH_IN}" wide), dynamic height, edge-to-edge slides, ${SCALE}×`
  );
} finally {
  await browser.close();
}
