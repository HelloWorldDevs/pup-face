'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('fbads', 'women18to24', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'women15to34', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'women35to44', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'women45to54', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'women55to64', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'women65plus', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men18to24', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men15to34', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men35to44', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men45to54', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men55to64', Sequelize.FLOAT),
      queryInterface.addColumn('fbads', 'men65plus', Sequelize.FLOAT)
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
