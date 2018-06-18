const striptags = require('striptags');

const getHighLow = require('./getHighLow');
const getDateString = require('./getDateString');
const fbad = require('../models').fbad;

module.exports = async (adData, pageDataObj, keyword) => {
  console.log(keyword);
  console.log("adData: ");
  // console.log(adData[0]);
  // console.log(pageData);
  // console.log('Saving ads to database.');
  adData.forEach(ad => {
    let impressions = getHighLow(ad["adInsightsInfo"]["impressions"]);
    let spending = getHighLow(ad["adInsightsInfo"]["spend"]);
    let pageData = pageDataObj[ad.adArchiveID];
    // console.log(pageData);
    let newAd = {
      archiveid: ad.adArchiveID,
      keyword: keyword,
      date: new Date(),
      pagename: pageData.fields.page_name,
      sponsor: pageData.fields.byline === '' ? "No Sponsor" : pageData.fields.byline,
      posttext: striptags(pageData.fields.body.markup.__html).slice(0, 4000),
      headline: pageData.fields.title,
      startdate: getDateString(new Date(ad.startDate)),
      enddate: getDateString(new Date(ad.endDate)),
      status: ad.isActive ? "Active" : "Inactive",
      lowimpressions: impressions[0],
      highimpressions: impressions[1],
      lowspending: spending[0],
      highspending: spending[1]
    };
    console.log(newAd);
    fbad.create(newAd);





    // ad.lowimpressions = impressions[0];
    // ad.highimpressions = impressions[1];
    // ad.lowspending = spending[0];
    // ad.highspending = spending[1];
    // ad.date = new Date();
    // Ad.create(ad);
  });

};