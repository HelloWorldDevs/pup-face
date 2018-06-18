const striptags = require('striptags');

const getHighLow = require('./getHighLow');
const getDateString = require('./getDateString');
const fbad = require('../models').fbad;

module.exports = (adData, pageDataObj, keyword) => {
  console.log(`Saving ${adData.length} ads to database for keyword ${keyword}.`);
  adData.forEach(ad => {
    let impressions = getHighLow(ad["adInsightsInfo"]["impressions"]);
    let spending = getHighLow(ad["adInsightsInfo"]["spend"]);
    let pageData = pageDataObj[ad.adArchiveID];

    let newAd = {
      archiveid: ad.adArchiveID,
      keyword: keyword,
      date: new Date(),
      pagename: pageData.fields.page_name,
      sponsor: pageData.fields.byline === '' ? "No Sponsor" : pageData.fields.byline,
      posttext: striptags(pageData.fields.body.markup.__html).slice(0, 4000),
      headline: pageData.fields.title,
      startdate: ad.startDate ? getDateString(new Date(ad.startDate * 1000)): null,
      enddate: ad.endDate ? getDateString(new Date(ad.endDate * 1000)) : null,
      status: ad.isActive ? "Active" : "Inactive",
      lowimpressions: impressions[0],
      highimpressions: impressions[1],
      lowspending: spending[0],
      highspending: spending[1]
    };

    fbad.create(newAd);
  });

};