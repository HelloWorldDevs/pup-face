const Scrape = require("../models").scrape;
const errorHandle = require("./errorHandle");

// Experimental method of intercepting Ajax call to get data directly
module.exports = () => {
  let insightArray = [];
  let passNumber = 0;
  let insightCount;
  return (response, { currentKeyword, hash }) => {
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
