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
      let adsByKeyword = {};
      let archiveIds = {};
      data.forEach(obj => {
        if (obj.target === "pageData") {
          let json = JSON.parse(obj.response.slice(9)).payload.results;

          if (obj.keyword in adsByKeyword) {
            let combined = adsByKeyword[obj.keyword].concat(json);
            adsByKeyword[obj.keyword] = combined;
          } else {
            adsByKeyword[obj.keyword] = json;
          }
        }
      });

      for (keyword in adsByKeyword) {
        archiveIds[keyword] = [];
        adsByKeyword[keyword].forEach(el =>
          archiveIds[keyword].push({
            startDate: el.startDate,
            endDate: el.endDate,
            adArchiveID: el.adArchiveID
          })
        );
      }

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
