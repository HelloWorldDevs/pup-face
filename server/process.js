const _ = require('lodash');
const process = require('./utils/processScrapes');
const Scrape = require('./models').scrape;


(async () => {

  Scrape.findAll({
    where: {
      status: 'new'
    }
  }).then((data) => {
    // console.log(data);
    let hashes = _.uniqBy(data, 'hash').map(d => d.hash);
    console.log(hashes);
    hashes.forEach(hash => {
      process(hash);
    });
  });
})();