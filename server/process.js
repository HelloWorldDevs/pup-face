const _ = require("lodash");
const processScrapes = require("./utils/processScrapes");
const Scrape = require("./models").scrape;
const sequelize = require("sequelize");
const cmdLineFlags = require("./cmdLineFlags");

const args = process.argv;
const query = cmdLineFlags(args);

(async () => {
  return await Scrape.findAll({
    where: query
  })
    .then(async data => {
      let hashes = _.uniqBy(data, "hash").map(d => d.hash);
      console.log(`Processing data for scrape hashes:`);
      console.log(hashes.join("\n"));
      debugger;
      await hashes.forEach(async hash => {
        await processScrapes(hash);
      });
    })
    .then(() => {
      console.log("Finished Processing.");
    });
})();
