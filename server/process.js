const _ = require('lodash');
const process = require('./utils/processScrapes');
const Scrape = require('./models').scrape;


(async () => {

  return await Scrape.findAll({
    where: {
      status: 'new'
    }
  }).then(async (data) => {
    // console.log(data);
    let hashes = _.uniqBy(data, 'hash').map(d => d.hash);
    console.log(`Processing data for scrape hashes:`);
    console.log(hashes.join('\n'));
    await hashes.forEach(async hash => {
      await process(hash);
    });
  }).then(() => {
    console.log('Finished Processing.');
  });
})();