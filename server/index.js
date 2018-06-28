const puppeteer = require('puppeteer');
const googleSheets = require('./utils/googleSheets');
const getKeywords = googleSheets.getKeywords;
const login = require('./utils/login');
const autoScroll = require('./utils/autoScroll');
const sleep = require('./utils/sleep');
const saveSearchToHistory = require('./utils/saveSearchToHistory');
const shouldRunSearch = require('./utils/shouldRunSearch');
const saveScrape = require('./utils/saveScrape');

(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true
  });
  const keywords = await getKeywords();

  let page = await browser.newPage();
  page = await login(page);

  await page.setRequestInterception(true);

  let currentKeyword;

  // enable log forwarding
  // TODO: Find out why this isn't working
  // page.on('console', msg => {
  //   for (let i = 0; i < msg.args.length; ++i)
  //     console.log(`${i}: ${msg.args[i]}`);
  // });

  page.on('request', request => {
    request.continue(); // pass it through.
  });

  // Experimental method of intercepting Ajax call to get data directly
  // Triggers on every ajax response, filters by relevant results, saves to database
  page.on('response', saveScrape);

  // Loop over keywords, search, and scroll to bottom of each
  console.log(`\nSearching for Keywords:\n${keywords.join(', ')}\n`);
  for(let k=0; k<keywords.length; k++) {
    currentKeyword = keywords[k];

    // TODO: scrape page result count and print to console

    // Check search history and skip keyword if it has run already today.
    // let shouldRun = await shouldRunSearch(currentKeyword);
    // if(!shouldRun) {
    //   console.log(`Search for [${currentKeyword}] already ran today. Skipping.`);
    //   continue;
    // }

    // Wait random lengths
    if(k !== 0) {
      let random = Math.floor(Math.random() * 5);
      console.log(`Waiting ${random} seconds`);
      await sleep(random * 1000);
    }

    // Open page for keyword search
    console.log(`\nSearching for [${currentKeyword}]\n-----------------------------------`);
    await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${currentKeyword}`, {
      waitUntil: 'networkidle2'
    });


    // Scroll to load all results
    console.log('Scrolling to load all results. This may take a while for many results.');
    await autoScroll(page);

    console.log('Waiting 5 seconds for all results');
    // saveSearchToHistory(currentKeyword); // Save search term to history
    await sleep(5000);

  }
  console.log(`Scan Complete.`);
  await browser.close();

  setTimeout((function() {
    return process.exit(22);
  }), 5000);
})();
