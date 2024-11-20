const {Sequelize, Model, DataTypes} = require('sequelize');
const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize  = new Sequelize("reservas_restaurante", "root", "hernandez1",{
    host: "localhost",
    dialect: "mysql",
    port: "3306"
});

class Usuario extends Model{}

Usuario.init({

    usuario_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    usuario_nombre:{
        type: DataTypes.STRING,
        allowNull:false
    },
    usuario_email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isEmail:true
        }

    },
    usuario_password:{
        Type:DataTypes.String

    },
    usuario_rol:{

    },


});
module.exports = Usuario;