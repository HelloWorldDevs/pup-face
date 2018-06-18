module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fbads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      archiveid: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY
      },
      pagename: {
        type: Sequelize.STRING
      },
      sponsor: {
        type: Sequelize.TEXT
      },
      posttext: {
        type: Sequelize.TEXT
      },
      imagealt: {
        type: Sequelize.STRING
      },
      headline: {
        type: Sequelize.TEXT
      },
      startdate: {
        type: Sequelize.DATEONLY
      },
      enddate: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING
      },
      lowimpressions: {
        type: Sequelize.INTEGER
      },
      highimpressions: {
        type: Sequelize.INTEGER
      },
      lowspending: {
        type: Sequelize.INTEGER
      },
      highspending: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fbads');
  }
};