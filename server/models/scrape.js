module.exports = (sequelize, DataTypes) => {
  const Scrape = sequelize.define('scrape', {
    hash: DataTypes.STRING,
    request: DataTypes.TEXT,
    response: DataTypes.TEXT,
    target: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Scrape.associate = function(models) {
    // associations can be defined here
  };
  return Scrape;
};