const puppeteer = require('puppeteer');

const googleSheets = require('./utils/googleSheets');
const getKeywords = googleSheets.getKeywords;
const saveResults = googleSheets.saveResults;
const login = require('./utils/login');
const autoScroll = require('./utils/autoScroll');
const saveAds = require('./utils/saveAds');
const saveSearchToHistory = require('./utils/saveSearchToHistory');
const shouldRunSearch = require('./utils/shouldRunSearch');

(async () => {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: false,
  });
  const keywords = await getKeywords();
  let page = await browser.newPage();
  page = await login(page);

  console.log(`\nSearching for Keywords:\n${keywords.join(', ')}\n`);

  let resultCount = 0;
  for(let k=0; k<keywords.length; k++) {
    let currentKeyword = keywords[k];

    // Check search history and skip keyword if it has run already today.
    let shouldRun = await shouldRunSearch(currentKeyword);
    if(!shouldRun) {
      console.log(`Search for [${currentKeyword}] already ran today. Skipping.`);
      continue;
    }

    console.log(`Searching for [${currentKeyword}]`);
    await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${currentKeyword}`, {
      waitUntil: 'networkidle2'
    });

    console.log('Scrolling to load all results. This may take a while for many results.');
    await autoScroll(page);
    console.log(`Scrolling complete. Scraping [${currentKeyword}]`);

    let results = await page.$$eval('a', (anchors, currentKeyword) => {
      // code within eval statements are run client-side
      return new Promise((resolve, reject) => {
        let current = 0;
        let values = [];
        let results = anchors.filter(anchor => anchor.textContent === 'See Ad Performance');
        console.log(results.length + ' results found');
        // open next window
        if(results.length) {
          let getData = setInterval(() => {
            results[current].click();
            // queries
            let modal = '.uiLayer > div:nth-child(2) > div button + div + div > div > div';

            // Left Column
            let leftColumnQuery = `${modal} > div:nth-child(1)`;
            let mainTitleBoxQuery = `${leftColumnQuery} > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div`;

            let pageName = document.querySelector(`${mainTitleBoxQuery} > span > a`);
            let sponsor = document.querySelector(`${mainTitleBoxQuery} > div:nth-child(2) > div > div span:nth-child(2) > span`);
            let postText = document.querySelector(`${leftColumnQuery} > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)`);
            let image = document.querySelector(`${leftColumnQuery} > div:nth-child(1) > div:nth-child(1) > img`);
            let headline = document.querySelector(`${leftColumnQuery} > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > div > div:nth-child(1)`);

            // Right Column
            let rightColumnQuery = `${modal} > div:nth-child(2)`;

            let status = document.querySelector(`${rightColumnQuery} > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)`);
            let activity = document.querySelector(`${rightColumnQuery} > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)`);
            let impressions = document.querySelector(`${rightColumnQuery} > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)`);
            let spending = document.querySelector(`${rightColumnQuery} > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)`);

            postText = postText ? postText.innerText : "";

            values.push({
              keyword: currentKeyword,
              pagename: pageName ? pageName.innerText : "",
              posttext: postText.length > 1000 ? postText.slice(0, 1000) + '...' : postText,
              imagealt: image ? image.alt : "",                 // image alt is often empty
              headline: headline ? headline.innerText : "",
              status: status ? status.innerText : "",
              activity: activity ? activity.innerText : "",
              impressions: impressions ? impressions.innerText : "",
              spending: spending ? spending.innerText : "",
              sponsor: sponsor ? sponsor.innerText : ""         // sponsor may be empty
            });
            // debugger;
            let popup = document.querySelector('.uiLayer');
            popup.parentNode.removeChild(popup);
            current++;
            if (current >= results.length) {
              console.log('All results printed');
              clearInterval(getData);
              return resolve(values);
            }
          }, 200);
        } else {
          return resolve(values);
        }

      });
    }, currentKeyword);

    console.log(`${results.length} Results found for [${currentKeyword}]`);
    console.log(`Saving results for ${currentKeyword} to google sheets.`);
    await saveAds(results); // save results to database
    saveResults(results); // save results to google sheets
    saveSearchToHistory(currentKeyword); // Save search term to history
    resultCount += results.length; // Add results to running total

  }
  console.log(`Scan Complete. ${resultCount} results found total.`);
  await browser.close();
})();
