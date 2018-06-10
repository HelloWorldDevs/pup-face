const puppeteer = require('puppeteer');

const getKeywords = require('./utils/getKeywords');
const login = require('./utils/login');
const autoscroll = require('./utils/autoscroll');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true,
  });
  const keywords = await getKeywords();
  let page = await browser.newPage();
  page = await login(page);

  console.log('keywords: ', keywords.join(', '));
  await page.screenshot({
    path: 'facebook.png'
  });


  await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${keywords[0]}`, {
    waitUntil: 'networkidle2'
  });

  // Page lazy loads, investigated possible auto scrolling to load all elements
  // await autoScroll(page);


  await page.$$eval('a', anchors => {
    let current = 0;
    let values = [];
    let results = anchors.filter(anchor => anchor.textContent === 'See Ad Performance');
    console.log(results.length + ' results found');
    // open next window

    let getData = setInterval(() => {
      results[current].click();
      let text = document.querySelector('.uiLayer > div:nth-child(2) > div button + div + div > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').innerText;
      values.push(text);
      console.log(text);
      // debugger;
      let closeButtons = document.querySelectorAll('.layerCancel');
      for(let i = 0; i<closeButtons.length; i++) {
        closeButtons[i].click();
      }
      current ++;
      if(current >= results.length) {
        console.log('All results printed');
        clearInterval(getData);
      }
    }, 200);

    console.log(values);
    return results;
  });




  // await getPolPage('mccain');
  // await getPopUp('.fb_content > div > div:nth-child(2) > div:nth-child(2) div:nth-child(3) > div:nth-child(2) > div > a');
  // await getText('.uiLayer > div:nth-child(2) > div button + div + div > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)')



  // Page lazy loads, investigated possible auto scrolling to load all elements
  // await autoScroll(page);
  // console.log('done scrolling');
  // let all_page_links = await page.$$('a');

})();
