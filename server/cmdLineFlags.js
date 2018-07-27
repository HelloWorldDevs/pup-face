const queries = require("./flagQueries");

const groupKeyword = (argStart, argArray) => {};

module.exports = cmdArgs => {
  switch (cmdArgs[2]) {
    case "-dk":
      return queries.dateAndKeywordQuery(
        cmdArgs[3],
        cmdArgs.slice(4).join(" ")
      );
    case "-d":
      return queries.dateQuery(cmdArgs[3]);
    case "-k":
      return queries.keywordQuery(cmdArgs.slice(3).join(" "));
    default:
      console.log("hit and shouldnt");
      return {
        status: "new"
      };
  }
};
