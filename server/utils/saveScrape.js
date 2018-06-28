const Scrape = require('../models').scrape;

// Experimental method of intercepting Ajax call to get data directly
module.exports = (response, {currentKeyword, hash}) => {

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
    console.log(`saving ajax response for keyword [${currentKeyword}] and target [${target}]`);
    let scrapeData = {
      hash: hash,
      keyword: currentKeyword,
      request: url,
      response: textBody,
      target,
      status: 'new'
    };

    Scrape.create(scrapeData);
  });
};