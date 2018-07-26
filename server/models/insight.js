module.exports = (sequelize, DataTypes) => {
  const insight = sequelize.define(
    "insight",
    {
      keyword: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      response: DataTypes.TEXT
    },
    {}
  );
  insight.associate = function(models) {
    // associations can be defined here
  };
  return insight;
};
