const Search = require('../models').search;

module.exports = (keyword, count) => {
  console.log('Saving search to history.');
  Search.find({ where: { keyword: keyword } }).then(result => {
    if (result) {
      Search.update({lastrun: new Date(), results: count}, {where: {keyword: keyword}});
    } else {
      Search.create({keyword: keyword, lastrun: new Date(), results: count});
    }
  });
};