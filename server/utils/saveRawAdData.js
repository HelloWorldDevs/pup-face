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

    let ageRange1 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '18-24');
    let ageRange2 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '25-34');
    let ageRange3 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '35-44');
    let ageRange4 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '45-54');
    let ageRange5 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '55-64');
    let ageRange6 = ad["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '65+');
    let locations = ad["adInsightsInfo"]["locationData"].sort((a, b) => b.reach - a.reach)
      .filter(l => l.reach !== 0).map(l => l.region);

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
      highspending: spending[1],
      women18to24: ageRange1 ? ageRange1["female"] : null ,
      women15to34: ageRange2 ? ageRange2["female"] : null ,
      women35to44: ageRange3 ? ageRange3["female"] : null ,
      women45to54: ageRange4 ? ageRange4["female"] : null ,
      women55to64: ageRange5 ? ageRange5["female"] : null ,
      women65plus: ageRange6 ? ageRange6["female"] : null ,
      men18to24: ageRange1 ? ageRange1["male"] : null,
      men15to34: ageRange2 ? ageRange2["male"] : null,
      men35to44: ageRange3 ? ageRange3["male"] : null,
      men45to54: ageRange4 ? ageRange4["male"] : null,
      men55to64: ageRange5 ? ageRange5["male"] : null,
      men65plus: ageRange6 ? ageRange6["male"] : null,
      location1: locations[0] || null,
      location2: locations[1] || null,
      location3: locations[2] || null,
      location4: locations[3] || null,
      location5: locations[4] || null,
      location6: locations[5] || null,
      location7: locations[6] || null,
      location8: locations[7] || null,
      location9: locations[8] || null,
      location10: locations[9] || null
    };
    console.log(newAd);
    fbad.create(newAd);


  });

};