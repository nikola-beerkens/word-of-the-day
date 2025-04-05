// wordScraper.js
const puppeteer = require('puppeteer');

async function getPolishWord() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.innovativelanguage.com/word-of-the-day/polish', {
        waitUntil: 'networkidle2'
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
}

// This makes the function usable from Electron via require()
module.exports = { getPolishWord };
