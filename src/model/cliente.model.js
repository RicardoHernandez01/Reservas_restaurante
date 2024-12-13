const {Sequelize, Model, DataTypes, INTEGER} = require('sequelize');
const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize  = new Sequelize("reservas_restaurante", "root", "hernandez1",{
    host: "localhost",
    dialect: "mysql",
    port: "3306"
});

class Cliente extends Model{}

Cliente.init({
    cliente_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    cliente_nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    cliente_email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            isEmail: true
        
        }
    },
    cliente_password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    cliente_telefono:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[10,15]
        }
    },
    cliente_rol:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    cliente_notas:{
        type:DataTypes.STRING,
        allowNull:true

    },
    cliente_fecha_registro:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

},{
    sequelize,
    modelName: 'Cliente'
});

module.exports = Cliente;