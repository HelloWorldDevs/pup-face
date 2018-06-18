module.exports = (sequelize, DataTypes) => {
  const fbad = sequelize.define('fbad', {
    archiveid: DataTypes.STRING,
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
    highspending: DataTypes.INTEGER

  }, {});
  fbad.associate = function(models) {
    // associations can be defined here
  };
  return fbad;
};