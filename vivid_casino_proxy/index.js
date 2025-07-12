const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', async (req, res) => {
  const targetURL = 'https://fortunejack.com' + req.originalUrl;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(targetURL, { waitUntil: 'networkidle2' });

    // Branding replacement
    await page.evaluate(() => {
      // Change document title
      document.title = "VIVID Casino";

      // Remove any footer
      const footer = document.querySelector('footer');
      if (footer) footer.remove();

      // Replace FortuneJack mentions with VIVID
      const allElements = document.querySelectorAll('body, body *');
      allElements.forEach(el => {
        if (el.innerText && el.innerText.includes('FortuneJack')) {
          el.innerText = el.innerText.replace(/FortuneJack/g, 'VIVID');
        }
      });
    });

    const content = await page.content();
    res.send(content);
  } catch (err) {
    res.status(500).send("Error loading the game. Try again later.");
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`VIVID Proxy server running on port ${PORT}`);
});