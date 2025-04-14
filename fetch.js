const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');

function getChromiumExecPath() {
  const basePath = process.resourcesPath || __dirname;
  const execPath = path.join(basePath, 'chrome-win', 'chrome.exe');
  return execPath;
}

async function getPolishWord() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: getChromiumExecPath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto('https://www.innovativelanguage.com/word-of-the-day/polish', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('.wotd-widget-sentence-main-space-text');
    await page.waitForSelector('.wotd-widget-sentence-quizmode-space-text.english');

    const wordData = await page.evaluate(() => {
      const polish = document.querySelector('.wotd-widget-sentence-main-space-text')?.innerText.trim();
      const english = document.querySelector('.wotd-widget-sentence-quizmode-space-text.english')?.innerText.trim();
      return { polish, english };
    });

    await browser.close();
    return wordData;
  } catch (err) {
    log.error('[PUPPETEER ERROR]', err);
    return { polish: 'Error', english: `Could not fetch word: ${err.message}` };
  }
}

module.exports = { getPolishWord };
