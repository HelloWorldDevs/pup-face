const search = require('../models').search;
const getDateString = require('./getDateString');

module.exports = async (keyword) => {
  return new Promise((resolve, reject) => {
    search.find({
      where: {
        keyword: keyword
      }
    }).then(lastSearch => {
      let ranToday = lastSearch && getDateString(lastSearch.lastrun) === getDateString(new Date());
      return resolve(!ranToday);
    });
  });
};