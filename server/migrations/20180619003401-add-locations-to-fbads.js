'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('fbads', 'location1', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location2', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location3', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location4', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location5', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location6', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location7', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location8', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location9', Sequelize.STRING),
      queryInterface.addColumn('fbads', 'location10', Sequelize.STRING)
    ];
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
