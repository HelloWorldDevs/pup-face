
let makeRow = (data) => {
  let date = new Date();
  let impressions = getHighLow(data.impressions); // [low, high]
  let spending = getHighLow(data.spending); // [low, high]

  return [
    data.keyword, // "Keyword",
    getDateString(date), // "Today's Date",
    data.pageName, // "Page Name",
    data.sponsor, // "Paid for by",
    null, // "Unique Post Identifier",
    null, // "Post Text",
    null, // "Description of Image",
    null, // "Headline",
    null, // "Started running",
    null, // "Status",
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

let getNumber = (str) => {
  let num = parseInt(str.replace( /\D+/g, ''));
  if(str.indexOf('K') !== -1) {
    num = num * 1000;
  } else if(str.indexOf('M') !== -1) {
    num = num * 1000000;
  }
  return num || 0;
};


let getHighLow = (raw) => {
  let impressions = raw.split(/[-<]/u);
  return impressions.map(getNumber);
};

let getDateString = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
};



module.exports = makeRow;