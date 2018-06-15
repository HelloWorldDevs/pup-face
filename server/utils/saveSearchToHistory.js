const Search = require('../models').search;

module.exports = (keyword) => {
  Search.find({ where: { keyword: keyword } }).then(result => {
    console.log('Saving search to history.');
    if (result) {
      Search.update({lastrun: new Date()}, {where: {keyword: keyword}});
    } else {
      Search.create({keyword: keyword, lastrun: new Date()});
    }
  });
};