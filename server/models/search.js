'use strict';
module.exports = (sequelize, DataTypes) => {
  const search = sequelize.define('search', {
    keyword: {
      type: DataTypes.STRING,
      unique: true
    },
    lastrun: DataTypes.DATE
  }, {});
  search.associate = function(models) {
    // associations can be defined here
  };
  return search;
};