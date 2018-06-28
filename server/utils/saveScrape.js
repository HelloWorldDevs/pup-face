const Scrape = require('../models').scrape;

// Experimental method of intercepting Ajax call to get data directly
module.exports = (response) => {
  // TODO: generate random hash for search
  const req = response.request();
  let url = req.url();
  let target;
  if(url.indexOf(`https://www.facebook.com/politicalcontentads/ads/?q=`) >= 0) {
    target = 'insightData';
  } else if(url.indexOf('https://www.facebook.com/ads/political_ad_archive/creative_snapshot/?ids[0') >= 0) {
    target = 'pageData';
  } else {
    return;
  }

  debugger;

  response.text().then(function (textBody) {
    console.log(`saving ajax response for target: ${target}`);
    const hash = 'test';
    const response = textBody;
    const date = new Date();

    let scrapeData = {
      hash,
      request: url,
      response,
      target,
      date
    };

    Scrape.create(scrapeData);
  });
};