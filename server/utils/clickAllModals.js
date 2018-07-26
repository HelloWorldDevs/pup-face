const Insight = require("../models").insight;
const errorHandle = require("./errorHandle");

module.exports = async (page, currentKeyword) => {
  /*
    This is opening so long as I don't resolve the promise. But
    even then it only clicks until the standard 30 second timeout
    on the page.$$eval() function is reached, at which point it 
    throws to the catch.

    I need a way to force the program to wait for the targets.reduce()
    function to complete, and then continue.  I believe I'll need to 
    return a promise from the async function this file exports.

    If allowed to run though, this is going through the data and grabbing
    the insight data and saving it to the insight field in DB (new field I
    added, model is in models).
    - Corey
    */
  return await page
    .$$eval("a", (anchors, currentKeyword) => {
      return new Promise((res, rej) => {
        let targets = anchors.filter(
          a => a.textContent === "See Ad Performance"
        );

        targets
          .reduce(
            (prom, _, i) =>
              prom
                .then(
                  _ =>
                    new Promise(resolve => {
                      // using this to give modal a second to open
                      setTimeout(() => {
                        targets[i].click();
                        resolve();
                      }, 50);
                    })
                )
                .catch(err => {
                  errorHandle(err, "scrapePage.js targets.reduce() call");
                  rej();
                }),
            Promise.resolve()
          )
          .then(() => res());
      }).catch(err => {
        errorHandle(err, "scrapePage internal promise");
      });
    })
    .catch(err => errorHandle(err, "scrapePage.js page.$$eval() call"));

  // if below uncommented, it clicks modals til 30s
  //await page
  //  .waitForNavigation({ waitUntil: "networkidle2" })
  //  .catch(err =>
  //    errorHandle(err, "scrapePage.js page.waitForNavigation() call")
  //  );
};
