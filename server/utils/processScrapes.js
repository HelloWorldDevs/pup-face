const striptags = require('striptags');
const _ = require('lodash');

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
    console.log(`Processing ${results.length} Scrapes`);

    // get data objects from scrape results
    let promises = results.map(async (result, index, arr) => {
      // return array of new ad data objects
      return new Promise(async (resolve, reject) => {
        console.log(`Processing ${index + 1}/${arr.length}`);
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
        await result.update({status: 'processed'});
        return resolve(newAds);
      });
    });

    // Save all unique ads to the database
    return Promise.all(promises).then(async data => {
      let newAds = _.flatten(data);
      let unique = _.uniqBy(newAds, 'archiveid');
      console.log(`Creating ${unique.length} ad entries from page data`);
      await Ad.bulkCreate(unique);
    });

  }).then(() => {
    console.log('First pass complete. Loading Insight data');
    return Scrape.findAll({
      where: {
        status: 'new',
        target: 'insightData',
        hash: hash
      }
    })
  }).then( async results => {
    console.log(results.length);
    // Loads insight results and pulls data
    let promises = results.map(async (result, index, arr) => {
      return new Promise(async (resolve, reject) => {
        let payload = JSON.parse(result.response.slice(9)).payload;
        let results = payload.results;
        return resolve(results);
      });
    });

    // Get unique results
    return Promise.all(promises).then(async data => {
      let newAds = _.flatten(data);
      let unique = _.uniqBy(newAds, 'adArchiveID');
      console.log(`Updating ${unique.length} ad entries with insight data`);
      return unique;
    }).then(async data => {
      console.log(data[0]);
      console.log(data.length);
      return await data.map(async (insightData, index) => {
        console.log('updating record ' + index + ' of ' + data.length);
        await Ad.findOne({where: {
          archiveid: insightData.adArchiveID,
          scrapeid: hash
        }}).then(ad => {
          if(!ad) console.log('err');

        });
      });
    }).then(promises => {
      console.log(promises.length);
    });
  });
};