'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      location_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doc_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doc_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      net_sales_qty: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_table');
  }
};