module.exports = {
  dateAndKeywordQuery: (hashDate, keyword) => {
    return {
      createdAt: {
        $and: [
          { $gte: `${hashDate} 00:00:00` },
          { $lt: `${hashDate} 23:59:59` }
        ]
      },
      keyword: keyword
    };
  },

  dateQuery: hashDate => {
    return {
      createdAt: {
        $and: [
          { $gte: `${hashDate} 00:00:00` },
          { $lt: `${hashDate} 23:59:59` }
        ]
      }
    };
  },

  keywordQuery: keyword => {
    return {
      keyword: keyword
    };
  }
};
