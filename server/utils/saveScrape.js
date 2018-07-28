const Scrape = require("../models").scrape;
const errorHandle = require("./errorHandle");

// Experimental method of intercepting Ajax call to get data directly
module.exports = initVal => {
  let insightArray = [];
  let passNumber = 0;
  let insightCount;
  return (response, { currentKeyword, hash }) => {
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
      url.indexOf("https://www.facebook.com/ads/archive/async/insights") !== -1
    ) {
      target = "insightData";
    } else if (
      url.indexOf("https://www.facebook.com/ads/archive/async/search_ads") !==
      -1
    ) {
      target = "pageData";
    } else {
      return;
    }

    response
      .text()
      .then(function(textBody) {
        if (target === "pageData") {
          if (passNumber === 0) {
            let parsed = JSON.parse(textBody.slice(9)).payload.pageResults;
            insightCount = parsed.reduce((acc, val) => {
              return acc + val.count;
            }, 0);
            passNumber = 1;
          }
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
        } else if (target === "insightData") {
          let scrapeData = {
            hash: hash,
            keyword: currentKeyword,
            request: url,
            response: textBody,
            target,
            status: "new"
          };
          insightArray.push(scrapeData);

          // console log every 20 results for logs
          insightArray.length % 20 === 0
            ? console.log(
                `adding [insightData] for bulk insert, ${
                  insightArray.length
                } items so far`
              )
            : null;

          if (insightArray.length === insightCount) {
            console.log(
              `saving ajax response for keyword [${currentKeyword}] and target [${target}]`
            );
            Scrape.bulkCreate(insightArray);
            insightArray = [];
            passNumber = 0;
          }
        }
      })
      .catch(err => errorHandle(err, "saveScrape.js response.text() call"));
  };
};
