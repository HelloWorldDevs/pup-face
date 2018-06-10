const puppeteer = require('puppeteer');
const CRED = require('./creds');

const ID = {
  login: '#email',
  pass: '#pass'
};

let keywords = ["dialysis", "kidney"];

const sleep = async (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms)
  });
};

let login = async (page) => {

  // login
  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  });
  await page.waitForSelector(ID.login);
  console.log(CRED.user);
  console.log(ID.login);
  await page.type(ID.login, CRED.user);

  await page.type(ID.pass, CRED.pass);
  await sleep(500);

  await page.click("#loginbutton");

  console.log("login done");
  await page.waitForNavigation();

  await page.screenshot({
    path: 'facebook.png'
  });

  return page;
};

function autoScroll(page){
  return page.evaluate(() => {
    return new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          resolve(page);
        }
      }, 100);
    })
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let page = await browser.newPage();
  page = await login(page);

  await page.goto(`https://www.facebook.com/politicalcontentads/?active_status=all&q=${keywords[0]}`, {
    waitUntil: 'networkidle2'
  });



  let selector = 'a';
  let page_links = await page.$$eval(selector, anchors => {
    let results = anchors.filter(anchor => anchor.textContent === 'See Ad Performance');
    console.log(results.length + ' results found');
    results[0].click();
    // for(let i=0; i<results.length; i++ ) {
    //   results[i].click();
    //   document.querySelector('.layerCancel').click();
    // }

    // page is open here
    debugger;
    document.querySelector('.layerCancel').click();
    debugger;
    return results;
  });

  console.log(page_links);


  // Page lazy loads, investigated possible auto scrolling to load all elements
  // await autoScroll(page);
  // console.log('done scrolling');
  // let all_page_links = await page.$$('a');

})();
