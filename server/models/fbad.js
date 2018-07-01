module.exports = (sequelize, DataTypes) => {
  const fbad = sequelize.define('fbad', {
    archiveid: DataTypes.STRING,
    scrapeid: DataTypes.STRING,
    keyword: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    pagename: DataTypes.STRING,
    sponsor: DataTypes.TEXT,
    posttext: DataTypes.TEXT,
    imagealt: DataTypes.STRING,
    headline: DataTypes.TEXT,
    startdate: DataTypes.STRING,
    enddate: DataTypes.STRING,
    status: DataTypes.STRING,
    lowimpressions: DataTypes.INTEGER,
    highimpressions: DataTypes.INTEGER,
    lowspending: DataTypes.INTEGER,
    highspending: DataTypes.INTEGER,
    women18to24: DataTypes.FLOAT,
    women15to34: DataTypes.FLOAT,
    women35to44: DataTypes.FLOAT,
    women45to54: DataTypes.FLOAT,
    women55to64: DataTypes.FLOAT,
    women65plus: DataTypes.FLOAT,
    men18to24: DataTypes.FLOAT,
    men15to34: DataTypes.FLOAT,
    men35to44: DataTypes.FLOAT,
    men45to54: DataTypes.FLOAT,
    men55to64: DataTypes.FLOAT,
    men65plus: DataTypes.FLOAT,
    location1: DataTypes.STRING,
    location2: DataTypes.STRING,
    location3: DataTypes.STRING,
    location4: DataTypes.STRING,
    location5: DataTypes.STRING,
    location6: DataTypes.STRING,
    location7: DataTypes.STRING,
    location8: DataTypes.STRING,
    location9: DataTypes.STRING,
    location10: DataTypes.STRING
  }, {});
  fbad.associate = function(models) {
    // associations can be defined here
  };
  return fbad;
};