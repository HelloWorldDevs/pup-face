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
    .$$eval("a", (anchors, currentKeyword, page) => {
      let targets = anchors.filter(
        a =>
          a.textContent === "See Ad Performance" ||
          a.textContent === "Uncover Ad & See Ad Performance"
      );
      return new Promise((res, rej) => {
        /*
        Where the fun begins.
        Need to loop over all the anchors we filtered above, but async.  Using
        reduce() we get a return value to the accumulator every pass, and we
        give the 'initial argument' of reduce to pass in a resolved promise to
        start things off, so the accumulator is repeatedly received a resolved
        promise.  We can then immediately .then() and kick off a promise
        chain for the loop.  Essentially the reduce function is just chaining a 
        bunch of .then() for the length of the targets array.
        */
        targets
          .reduce((prom, _, idx) => {
            return prom
              .then(_ => {
                return new Promise(resolve => {
                  targets[idx].click();
                  setTimeout(() => {
                    let child = document.getElementsByClassName("uiLayer")[0];
                    document.getElementsByTagName("body")[0].removeChild(child);
                    resolve();
                  }, 300);
                });
              })
              .catch(err => {
                errorHandle(err, "scrapePage.js targets.reduce() call");
                rej();
              });
          }, Promise.resolve()) //INITIAL ARGUMENT PASSED TO REDUCE
          .then(() => res()); // resolve the promise on line 27 and exit the function once reduce is done
      }).catch(err => {
        errorHandle(err, "scrapePage internal promise"); // catch for return promise
      });
    })
    .catch(err => errorHandle(err, "scrapePage.js page.$$eval() call")); // catch for puppeteer $$eval
};
