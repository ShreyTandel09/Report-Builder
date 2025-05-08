'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sales_table', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            location_code: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            doc_no: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            doc_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            net_sales_qty: {
                type: Sequelize.FLOAT,
                allowNull: false
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sales_table');
    }
}; 