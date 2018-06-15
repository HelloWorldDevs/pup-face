const getHighLow = require('./getHighLow');
const Ad = require('../models').ad;

const saveAds = async (ads) => {
  console.log('Saving ads to database.');
  ads.forEach(ad => {
    let impressions = getHighLow(ad.impressions);
    let spending = getHighLow(ad.spending);
    ad.lowimpressions = impressions[0];
    ad.highimpressions = impressions[1];
    ad.lowspending = spending[0];
    ad.highspending = spending[1];
    ad.date = new Date();
    Ad.create(ad);
  });
};

module.exports = saveAds;