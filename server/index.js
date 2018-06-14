const puppeteer = require('puppeteer');

const googleSheets = require('./utils/googleSheets');
const getKeywords = googleSheets.getKeywords;
const saveResults = googleSheets.saveResults;
const login = require('./utils/login');
const autoScroll = require('./utils/autoScroll');

(async () => {

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true,
  });
  // TODO: turn back on keyword loading to get all results in production
  const keywords = await getKeywords();
  // const keywords = ['Doug Robinson'];
  let page = await browser.newPage();
  page = await login(page);

  console.log('keywords: ', keywords.join(', '));
  await page.screenshot({
    path: 'facebook.png'
  });


  let allResults = [];
  for(let k=0; k<keywords.length; k++) {

    let currentKeyword = keywords[k];
    console.log('Searching for keyword: ' + currentKeyword);
    await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${currentKeyword}`, {
      waitUntil: 'networkidle2'
    });

    // Page lazy loads, investigated possible auto scrolling to load all elements
    // only needed if >= 30 results
    // console.log('Scrolling to load all results');
    // TODO: turn back on autoScroll to get all results in production
    await autoScroll(page);

    console.log('Scrolling complete. Scraping keyword: ' + currentKeyword);
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
              pageName: pageName ? pageName.innerText : "",
              postText: postText.length > 1000 ? postText.slice(0, 1000) + '...' : postText,
              imageAlt: image ? image.alt : "",                 // image alt is often empty
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

    console.log(results.length + ' Results found for keyword ' + currentKeyword);

    console.log('Saving results for ' + currentKeyword + ' to google sheets');
    saveResults(results);

    allResults = allResults.concat(results);

  }
  console.log('Scan Complete.' + allResults.length + ' results found total.');
  await browser.close();
})();
