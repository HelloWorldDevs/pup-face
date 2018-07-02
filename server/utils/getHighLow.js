const getHighLow = (raw) => {
  let impressions = raw.split(/[-<]/u);
  // if '>1M', enter same value for high/low
  if(raw.indexOf('>') >= 0) {
    impressions[1] = impressions[0];
  }
  return impressions.map(getNumber);
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

module.exports = getHighLow;