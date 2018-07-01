const striptags = require('striptags');
const _ = require('lodash');

const getHighLow = require('./getHighLow');
const getDateString = require('./getDateString');

const Scrape = require('../models').scrape;
const Ad = require('../models').fbad;

module.exports = async (hash) => {
  console.log(`Processing Scraped Data for scrape ${hash}`);

  return await Scrape.findAll({
    where: {
      status: 'new',
      target: 'pageData',
      hash: hash
    }
  }).then( async results => {
    // get data objects from scrape results
    let promises = results.map(async (result) => {
      // return array of new ad data objects
      return new Promise(async (resolve) => {
        let payload = JSON.parse(result.response.slice(9)).payload;
        let results = _.values(payload);
        let newAds = results.map(pageData => {
          return {
            archiveid: pageData.adArchiveID,
            scrapeid: result.hash,
            keyword: result.keyword,
            date: result.createdAt,
            pagename: pageData.fields.page_name,
            sponsor: pageData.fields.byline === '' ? "No Sponsor" : pageData.fields.byline,
            posttext: striptags(pageData.fields.body.markup.__html).slice(0, 4000),
            headline: pageData.fields.title
          };
        });
        return resolve(newAds);
      });
    });

    // Get unique results for page data
    return Promise.all(promises).then(async data => {
      let newAds = _.flatten(data);
      let unique = _.uniqBy(newAds, 'archiveid');
      console.log(`Found ${unique.length} unique page data objects`);
      return unique;
    });

  }).then((partialAds) => {
    let master = _.keyBy(partialAds, 'archiveid');

    console.log('First pass complete. Loading Insight data');
    return Scrape.findAll({
      where: {
        status: 'new',
        target: 'insightData',
        hash: hash
      }
    }).then(async results => {
      // Loads insight results and pulls data
      let promises = results.map(async (result, index, arr) => {
        return new Promise(async (resolve, reject) => {
          let payload = JSON.parse(result.response.slice(9)).payload;
          let results = payload.results;
          return resolve(results);
        });
      });

      // Get unique results for insight data
      return Promise.all(promises).then(async data => {
        let newAds = _.flatten(data);
        let unique = _.uniqBy(newAds, 'adArchiveID');
        console.log(`Found ${unique.length} unique insight data objects`);
        return unique;
      });
    }).then( async insightData => {
      // let missing = insightData.filter(u => master[u.adArchiveID] === undefined);
      // console.log(missing.length);
      insightData.forEach(insight => {
        let pageData = master[insight.adArchiveID];
        let impressions = getHighLow(insight["adInsightsInfo"]["impressions"]);
        let spending = getHighLow(insight["adInsightsInfo"]["spend"]);

        let ageRange1 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '18-24');
        let ageRange2 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '25-34');
        let ageRange3 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '35-44');
        let ageRange4 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '45-54');
        let ageRange5 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '55-64');
        let ageRange6 = insight["adInsightsInfo"]["ageGenderData"].find(d => d.age_range === '65+');
        let locations = [];
        if(insight["adInsightsInfo"]["locationData"]) {
          locations = insight["adInsightsInfo"]["locationData"].sort((a, b) => b.reach - a.reach)
            .filter(l => l.reach !== 0).map(l => l.region);
        }

        let newAdData = {
          startdate: insight.startDate ? getDateString(new Date(insight.startDate * 1000)): null,
          enddate: insight.endDate ? getDateString(new Date(insight.endDate * 1000)) : null,
          status: insight.isActive ? "Active" : "Inactive",
          lowimpressions: impressions[0],
          highimpressions: impressions[1],
          lowspending: spending[0],
          highspending: spending[1],
          women18to24: ageRange1 ? ageRange1["female"] : null,
          women15to34: ageRange2 ? ageRange2["female"] : null,
          women35to44: ageRange3 ? ageRange3["female"] : null,
          women45to54: ageRange4 ? ageRange4["female"] : null,
          women55to64: ageRange5 ? ageRange5["female"] : null,
          women65plus: ageRange6 ? ageRange6["female"] : null,
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

        Object.assign(pageData, newAdData);
      });

    }).then(async () => {
      let newAds = _.values(master);
      console.log(`Saving ${newAds.length} complete Ads to database`);
      await Ad.bulkCreate(newAds);
      console.log('Saving Complete');
      console.log('timeout in 5 seconds');

      setTimeout((function() {
        return process.exit(22);
      }), 5000);
    });
  });
};