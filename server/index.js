const puppeteer = require('puppeteer');

const googleSheets = require('./utils/googleSheets');
const getKeywords = googleSheets.getKeywords;
const saveResults = googleSheets.saveResults;
const login = require('./utils/login');
const autoScroll = require('./utils/autoScroll');
const saveAds = require('./utils/saveAds');
const sleep = require('./utils/sleep');
const saveSearchToHistory = require('./utils/saveSearchToHistory');
const shouldRunSearch = require('./utils/shouldRunSearch');
const scrapePage = require('./utils/scrapePage');

(async () => {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: false
  });
  const keywords = await getKeywords();
  let page = await browser.newPage();
  page = await login(page);

  await page.setRequestInterception(true);

  let ids = [];

  // enable log forwarding
  page.on('console', msg => {
    for (let i = 0; i < msg.args.length; ++i)
      console.log(`${i}: ${msg.args[i]}`);
  });

  // get ids of ads
  let getIds = (url) => {
    url = url.slice(76, -6);
    return url.split(/&ids\[\d+\]=/);
  };

  page.on('request', request => {
    let url = request.url();
    if(url.indexOf('https://www.facebook.com/ads/political_ad_archive/creative_snapshot/?ids[0') >= 0) {
      console.log('BINGO');
      console.log(url);
      ids = ids.concat(getIds(url));
      console.log(ids);
    }

    request.continue(); // pass it through.
  });

  // Experimental method of intercepting Ajax call to get data directly
  page.on('response', response => {
    const req = response.request();
    let url = req.url();
    if(url.indexOf('https://www.facebook.com/ads/political_ad_archive/creative_snapshot/?ids[0') >= 0) {
      // console.log('RESPONSE TO DATA');
      response.text().then(function (textBody) {
        // console.log(JSON.parse(textBody.slice(9)).payload);
      })
    }
    // console.log(req.method(), response.status(), req.url());
  });

  console.log(`\nSearching for Keywords:\n${keywords.join(', ')}\n`);

  let resultCount = 0;
  for(let k=0; k<keywords.length; k++) {
    let currentKeyword = keywords[k];
    // reset id queue
    ids = [];


    // Check search history and skip keyword if it has run already today.
    let shouldRun = await shouldRunSearch(currentKeyword);
    if(!shouldRun) {
      console.log(`Search for [${currentKeyword}] already ran today. Skipping.`);
      continue;
    }

    // Wait random lengths
    let random = Math.floor(Math.random() * 10);
    console.log(`Waiting ${random} seconds`);
    await sleep(random * 1000);

    // Open page for keyword search
    console.log(`\nSearching for [${currentKeyword}]\n-----------------------------------`);
    await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${currentKeyword}`, {
      waitUntil: 'networkidle2'
    });


    // Scroll to load all results
    console.log('Scrolling to load all results. This may take a while for many results.');
    await autoScroll(page);
    console.log(`Scrolling complete. Scraping [${currentKeyword}]`);

    let results = await scrapePage(page, currentKeyword, ids);

    console.log(`${results.length} Results found for [${currentKeyword}].`);
    await saveAds(results); // save results to database
    // await saveResults(results); // save results to google sheets
    saveSearchToHistory(currentKeyword); // Save search term to history
    resultCount += results.length; // Add results to running total

  }
  console.log(`Scan Complete. ${resultCount} results found total.`);
  await browser.close();
})();
