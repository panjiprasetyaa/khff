const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    await page.goto('https://khff-seven.vercel.app/galeri', { waitUntil: 'networkidle0' });
    console.log("Page loaded successfully.");
    const content = await page.content();
    if (content.includes("This page couldn't load")) {
        console.log("Found the error overlay!");
    }
  } catch (err) {
    console.log("Error navigating:", err);
  }

  await browser.close();
})();
