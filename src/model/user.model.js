const {Sequelize, Model, DataTypes} = require('sequelize');
require('dotenv').config();

const{ toDefaultValue } = require('sequelize/lib/utils');
const bcrypt = require('bcryptjs');

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
    usuario_password: {
        type: DataTypes.STRING, // Corregido "Type" a "type"
        allowNull: false
    },
    usuario_telefono:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    usuario_rol:{
        type:DataTypes.STRING,
        allowNull:false
    },

},{
    sequelize,
    modelName:'Usuario',

    hooks: {
        // Hook para encriptar la contraseña antes de guardar el usuario
        beforeCreate: async (usuario) => {
            if (usuario.usuario_password) {
                const salt = await bcrypt.genSalt(10);
                usuario.usuario_password = await bcrypt.hash(usuario.usuario_password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('usuario_password')) {
                const salt = await bcrypt.genSalt(10);
                usuario.usuario_password = await bcrypt.hash(usuario.usuario_password, salt);
            }
        }
    }

});
module.exports = Usuario;