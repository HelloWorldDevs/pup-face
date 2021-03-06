module.exports = (sequelize, DataTypes) => {
  const Ad = sequelize.define('ad', {
    upi: DataTypes.STRING,
    keyword: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    pagename: DataTypes.STRING,
    sponsor: DataTypes.TEXT,
    posttext: DataTypes.TEXT,
    imagealt: DataTypes.STRING,
    headline: DataTypes.TEXT,
    activity: DataTypes.STRING,
    status: DataTypes.STRING,
    lowimpressions: DataTypes.INTEGER,
    highimpressions: DataTypes.INTEGER,
    lowspending: DataTypes.INTEGER,
    highspending: DataTypes.INTEGER

  }, {});
  Ad.associate = function(models) {
    // associations can be defined here
  };
  return Ad;
};