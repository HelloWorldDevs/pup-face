const errorHandle = require("./errorHandle");

module.exports = async (page, currentKeyword) => {
  return await page
    .$$eval("a", (anchors, currentKeyword) => {
      // code within eval statements are run client-side
      return new Promise((resolve, reject) => {
        let current = 0;
        let values = [];
        let results = anchors.filter(
          anchor => anchor.textContent === "See Ad Performance"
        );
        console.log(results.length + " results found");
        // open next window
        if (results.length) {
          // let getData = setInterval(() => {
          results[current].click().catch(err => {
            errorHandle(err, "scrapePage.js results[idx].click() call");
            reject();
          });
          /*
          Values returned here or the else clause go back to index.js into the
          results variable near bottom of file.  That is what is passed to saveAds.js
          which saves the results to the database as 'ads'
          - Corey
          */
          return resolve(); // return value for saveAds() in index.js

          /*

          We need to grab that data and save to database.
          Flow:
          1 load keyword page
          2 scroll to bottom to force all html to load
          3 run page.$$eval('a') to get array of anchors
          4 filter that array for 'See Ad Performance' textContent
          5 run async loop, repeats for every 'See Ad Performance' anchor:
              > click anchor
              > wait for response data
              > parse body
              > save body to database
              > close modal

          ------------------------------------------

          COMMENTED OUT OLD METHOD OF SCRAPING HTML
          ===============================================================================
          Shouldn't need to do this anymore, when we click the 'See Ad Performance' anchor
          there is a req/res from the server that contains all the insight data we want.
          - Corey
          ===============================================================================
          // OLD METHOD
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
            upi: ids.shift(),
            keyword: currentKeyword,
            pagename: pageName ? pageName.innerText : "",
            posttext: postText.length > 1000 ? postText.slice(0, 1000) + '...' : postText,
            imagealt: image ? image.alt : "",                 // image alt is often empty
            headline: headline ? headline.innerText : "",
            status: status ? status.innerText : "",
            activity: activity ? activity.innerText : "",
            impressions: impressions ? impressions.innerText : "",
            spending: spending ? spending.innerText : "",
            sponsor: sponsor ? sponsor.innerText : "No Sponsor"         // sponsor may be empty
          });
          // debugger;
          let popup = document.querySelector('.uiLayer');
          popup.parentNode.removeChild(popup);
          current++;
          if (current >= results.length) {
            console.log('All results printed');
            clearInterval(getData);
            return resolve(values);
          } else {
            console.log(`Scraping ${current}/${results.length}`);
          }
        }, 200);
        */
        } else {
          return resolve(values);
        }
      });
    })
    .catch(err => errorHandle(err, "scrapePage.js page.$$eval() call"));
};
