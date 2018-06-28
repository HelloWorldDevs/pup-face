'use strict';
module.exports = (sequelize, DataTypes) => {
  const search = sequelize.define('search', {
    keyword: {
      type: DataTypes.STRING,
      unique: true
    },
    lastrun: DataTypes.DATE,
    results: DataTypes.STRING
  }, {});
  search.associate = function(models) {
    // associations can be defined here
  };
  return search;
};