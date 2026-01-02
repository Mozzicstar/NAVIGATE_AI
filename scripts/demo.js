// Puppeteer demo: runs a short recorded UI flow for the agent travel demo
// Usage: (from repo root) cd relocate-ai && node ../scripts/demo.js

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const base = 'http://localhost:3000';
  await page.goto(base, { waitUntil: 'networkidle2' });

  // Navigate to the flow: click Start Planning -> choose purpose -> fill form -> select a destination
  // The app is simple; if landing page present click Start
  await page.waitForTimeout(800);
  try {
    const startBtn = await page.$x("//button[contains(., 'Start Planning') or contains(., 'Start')] ");
    if (startBtn.length) { await startBtn[0].click(); }
  } catch (e) {}

  // Wait and navigate to checklist page; as a quick path, directly set path to / (app routes may vary)
  await page.waitForTimeout(1000);

  // Ensure agent dashboard exists
  await page.waitForSelector('h3');
  // Click Start (Agent) if present (the dashboard requires REACT_APP_AGENT_ENABLED=true when starting the client locally)
  try {
    await page.click('button');
  } catch (e) {}

  // Try to find the Agent Dashboard Start button by text
  const startBtn = await page.$x("//button[contains(., 'Start') and following-sibling::text()[contains(., 'Status')]]");

  // Fallback: click the first Start we find in the page
  const startButtons = await page.$x("//button[contains(., 'Start')]");
  if (startButtons.length) {
    await startButtons[0].click();
  }

  await page.waitForTimeout(500);

  // Select action 'search_flights' from the select
  await page.evaluate(() => {
    const sel = document.querySelector('select');
    if (sel) {
      sel.value = 'search_flights';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(200);
  // Fill travel form inputs
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    // origin, destination, date, budget in order
    if (inputs[0]) inputs[0].value = 'NYC';
    if (inputs[1]) inputs[1].value = 'DXB';
    if (inputs[2]) inputs[2].value = '2026-02-01';
    if (inputs[3]) inputs[3].value = '1000';
  });

  await page.waitForTimeout(200);
  // Click Search flights button
  const searchBtn = await page.$x("//button[contains(., 'Search flights')]");
  if (searchBtn.length) await searchBtn[0].click();

  // Wait for the logs to show itineraries
  await page.waitForFunction(() => !!Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Itineraries for')) , { timeout: 10000 });
  await page.screenshot({ path: 'frame-01.png', fullPage: true });

  // Click Reserve option button
  const reserveBtn = await page.$x("//button[contains(., 'Reserve option')]");
  if (reserveBtn.length) { await reserveBtn[0].click(); }
  await page.waitForTimeout(500);

  // Approve queued reserve task - find Approve in Queue section
  const approveBtns = await page.$x("//div[contains(., 'Queue')]/following::button[contains(., 'Approve')]");
  if (approveBtns.length) {
    await approveBtns[0].click();
  } else {
    // fallback, click the first Approve button on page
    const allApprove = await page.$x("//button[contains(., 'Approve')]");
    if (allApprove.length) await allApprove[0].click();
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'frame-02.png', fullPage: true });

  await browser.close();
  console.log('Demo frames saved: frame-01.png, frame-02.png');
})();
