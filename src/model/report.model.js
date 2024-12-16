const {Sequelize, Model, DataTypes} = require('sequelize');
require('dotenv').config();

const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize = new Sequelize(
    process.env.DB_DBNAME, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: "3306", // Agrega el puerto
      dialect: "mysql",
    }
  );

class Report extends Model{}

Report.init({
    report_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    reservation_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Reservations',
            key: 'reservation_id'
        }
    },
    report_fecha:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW

    },


},{
    sequelize,
    modelName:'Report'
});

module.exports = Report;