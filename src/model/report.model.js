const {Sequelize, Model, DataTypes} = require('sequelize');
const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize  = new Sequelize("reservas_restaurante", "root", "hernandez1",{
    host: "localhost",
    dialect: "mysql",
    port: "3306"
});

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