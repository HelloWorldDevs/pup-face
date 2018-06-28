module.exports = (sequelize, DataTypes) => {
  const Scrape = sequelize.define('scrape', {
    hash: DataTypes.STRING,
    keyword: DataTypes.STRING,
    request: DataTypes.TEXT,
    response: DataTypes.TEXT,
    target: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Scrape.associate = function(models) {
    // associations can be defined here
  };
  return Scrape;
};