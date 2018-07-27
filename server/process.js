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
      let archiveIds = [];
      data.forEach(obj => {
        if (obj.target === "pageData") {
          let json = JSON.parse(obj.response.slice(9)).payload.results;
          json.map(d => archiveIds.push(d.adArchiveID));
        }
      });
      //let allPageData = [].concat.apply([], page_data);
      return { data, archiveIds };
    })
    .then(async dataObj => {
      let hashes = _.uniqBy(dataObj.data, "hash").map(d => d.hash);
      console.log(`Processing data for scrape hashes:`);
      console.log(hashes.join("\n"));
      await hashes.forEach(async hash => {
        await processScrapes(hash, dataObj.archiveIds);
      });
    })
    .then(() => {
      console.log("Finished Processing.");
    });
})();
