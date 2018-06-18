module.exports = async (page, currentKeyword, ids) => {
  return await page.$$eval('a', (anchors, currentKeyword, ids) => {
    // code within eval statements are run client-side
    return new Promise((resolve, reject) => {
      console.log(ids);
      let current = 0;
      let values = [];
      let results = anchors.filter(anchor => anchor.textContent === 'See Ad Performance');
      console.log(results.length + ' results found');
      // open next window
      if(results.length) {
        let getData = setInterval(() => {
          results[current].click();
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
      } else {
        return resolve(values);
      }

    });
  }, currentKeyword, ids);
};