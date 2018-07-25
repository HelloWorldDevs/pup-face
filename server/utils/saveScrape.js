const Scrape = require("../models").scrape;
const errorHandle = require("./errorHandle");

// Experimental method of intercepting Ajax call to get data directly
module.exports = (response, { currentKeyword, hash }) => {
  /*
  This if statement will always set target = "pageData". The URLs used
  by FB have changed.  This seems to be OK as the data we are still
  getting from this method is the pageData. It saves the raw response
  body under 'scrapes' in the database.

  TL;DR; This method gives us the pageData half of the data, the page
  scrape method (tweaked) is required for the other half.
  - Corey
  */
  const req = response.request();
  let url = req.url();
  let target;
  if (
    url.indexOf(`https://www.facebook.com/politicalcontentads/ads/?q=`) >= 0
  ) {
    target = "insightData";
  } else if (url.indexOf("https://www.facebook.com/adlibrary/") >= 0) {
    target = "pageData";
  } else {
    return;
  }

  debugger;

  response
    .text()
    .then(function(textBody) {
      console.log(
        `saving ajax response for keyword [${currentKeyword}] and target [${target}]`
      );
      let scrapeData = {
        hash: hash,
        keyword: currentKeyword,
        request: url,
        response: textBody,
        target,
        status: "new"
      };

      Scrape.create(scrapeData);
    })
    .catch(err => errorHandle(err, "saveScrape.js response.text() call"));
};
