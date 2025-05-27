'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('report_column_fields', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      field_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      source_table: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      field_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_filterable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_sortable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_groupable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      aggregation_type: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('report_column_fields');
  }
};