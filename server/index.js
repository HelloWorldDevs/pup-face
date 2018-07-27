const puppeteer = require("puppeteer");
const googleSheets = require("./utils/googleSheets");
//const getKeywords = googleSheets.getKeywords;
const crypto = require("crypto");
const login = require("./utils/login");
const autoScroll = require("./utils/autoScroll");
const sleep = require("./utils/sleep");
const saveSearchToHistory = require("./utils/saveSearchToHistory");
const shouldRunSearch = require("./utils/shouldRunSearch");
const saveScrape = require("./utils/saveScrape");
//const processScrapes = require("./utils/processScrapes");
const saveAds = require("./utils/saveAds");
const scrapePage = require("./utils/scrapePage");

const errorHandle = require("./utils/errorHandle");

const clickAllModals = require("./utils/clickAllModals");

// see README.md for command line args

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    devtools: false
  });

  /* 
  getKeywords() commented out for debug, this is how we get data from google sheets
  just passing a single value for testing
  - Corey
  */
  //const keywords = await getKeywords();
  const keywords = ["yes on 46"];
  const hash = crypto.randomBytes(20).toString("hex");
  const startTime = new Date();
  console.log(`Scrape Session Hash: ${hash}`);
  console.log(`Start Time: ${startTime}`);
  console.time("Scrape Time");

  let page = await browser.newPage();
  page = await login(page);
  await page.setRequestInterception(true);

  /*
  page.on() adds listeners with puppeteer that grab any requests
  or responses
  */
  // This might be necessary to get results, not sure why
  page.on("request", request => {
    request.continue(); // pass it through.
  });

  /*
  the page.on("response") below **should** catch the requests
  as well, haven't tested, not 100% sure of that
  -Corey
  */

  // Experimental method of intercepting Ajax call to get data directly
  // Triggers on every ajax response, filters by relevant results, saves to database
  await page.setRequestInterception(true);
  page.on("response", response => {
    saveScrape(response, { currentKeyword, hash });
  });

  // Loop over keywords, search, and scroll to bottom of each
  console.log(`\nSearching for Keywords:\n${keywords.join(", ")}\n`);
  let currentKeyword;
  /*
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  Main For Loop
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  */
  for (let k = 0; k < keywords.length; k++) {
    currentKeyword = keywords[k];

    // Check search history and skip keyword if it has run already today.
    // ############################################################
    // Removed for debug -Corey
    // ############################################################
    // let shouldRun = await shouldRunSearch(currentKeyword);
    // if (!shouldRun) {
    //   console.log(
    //     `Search for [${currentKeyword}] already ran today. Skipping.`
    //   );
    //   continue;
    // }
    // Wait random lengths
    if (k !== 0) {
      let random = Math.floor(Math.random() * 5);
      console.log(`Waiting ${random} seconds`);
      await sleep(random * 1000).catch(err =>
        errorHandle(err, "index.js sleep() call")
      );
    }

    // Open page for keyword search
    console.log(
      `\nSearching for [${currentKeyword}]\n-----------------------------------`
    );
    await page
      .goto(
        `https://www.facebook.com/ads/archive/?active_status=all&ad_type=ads-with-political-content&q=${currentKeyword}`,
        {
          waitUntil: "networkidle2"
        }
      )
      .catch(err => errorHandle(err, "index.js page.goto() call"));

    // Get result count and print to console. Stop loop if no results are found
    const resultsText = (await page.content()).match(/[~]?\d+\sresults/i);
    if (!resultsText) {
      console.log("No results found");
      continue;
    } else {
      // Scroll to load all results
      console.log(`Found ${resultsText}. Results are loaded 30 at a time.`);
      console.log(
        "Scrolling to load all results. This may take a while for many results."
      );
      await autoScroll(page).catch(err =>
        errorHandle(err, "index.js autoScroll() call")
      );
    }
    await clickAllModals(page, currentKeyword, hash);
    // await scrapePage(page, currentKeyword, hash);
    // save search term to history to prevent duplication
    saveSearchToHistory(currentKeyword, resultsText.toString());
    //let results = await scrapePage(page, currentKeyword, hash);
    debugger;
    //await saveAds(results).catch(err =>
    //  errorHandle(err, "index.js saveAds() call")
    //);
  }
  /*
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  End Main For Loop
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  */
  console.log(`Scan Complete.`);
  console.timeEnd("Scrape Time");

  // Code for running data processing. Fails here, not sure why. Set to run separately as a cron job for now
  // console.log(`\nStarting Processing\n-----------------------------------`);
  // processScrapes(hash);

  console.log(`End Time: ${new Date()}`);
  await browser.close();

  setTimeout(function() {
    return process.exit(22);
  }, 5000);
})();
