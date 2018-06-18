const getHighLow = require('./getHighLow');
const getDateString = require('./getDateString');

let makeRow = (data) => {
  let date = new Date();
  let impressions = getHighLow(data.impressions); // [low, high]
  let spending = getHighLow(data.spending); // [low, high]
  let activity = data.activity.indexOf('Started') >= 0 ? data.activity.split(' on ')[1] : data.activity;

  return [
    data.keyword, // "Keyword",
    getDateString(date), // "Today's Date",
    data.pagename, // "Page Name",
    data.sponsor, // "Paid for by",
    data.upi, // "Unique Post Identifier" (none found so far),
    data.posttext, // "Post Text",
    data.imagealt, // "Description of Image" (often, if not always, empty),
    data.headline, // "Headline",
    activity, // "Started running",
    data.status, // "Status",
    impressions[0], // "Low Impressions",
    impressions[1], // "High Impressions",
    spending[0], // "Low Money Spent",
    spending[1], // "High Money Spent"
    null, // "Men 18-24 (%)",
    null, // "Women 18-24 (%)",
    null, // "Men 25-34 (%)",
    null, // "Women 25-34 (%)",
    null, // "Men 35-44 (%)",
    null, // "Women 35-44 (%)",
    null, // "Men 45-54 (%)",
    null, // "Woman 45-54 (%)",
    null, // "Men 55-64 (%)",
    null, // "Women 55-64 (%)",
    null, // "Men 65+ (%)",
    null, // "Women 65+ (%)",
    null, // "Top Location 1",
    null, // "Top Location 2",
    null, // "Top Location 3",
    null, // "Top Location 4",
    null, // "Top Location 5",
    null, // "Top Location 6",
    null, // "Top Location 7",
    null, // "Top Location 8",
    null, // "Top Location 9",
    null // "Top Location 10"
  ];
};

module.exports = makeRow;