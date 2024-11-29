const {Sequelize, Model, DataTypes} = require('sequelize');
const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize  = new Sequelize("reservas_restaurante", "root", "hernandez1",{
    host: "localhost",
    dialect: "mysql",
    port: "3306"
});

//async sirve para crear un tabla en caso que no este creado o hacer una inserción si la tabla ya existe

class Table extends Model{}

Table.init({

    table_id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    table_numero:{
        type:DataTypes.INTEGER,
        allowNull: false

    },
    table_capacidad:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    table_ubicacion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    table_tipo:{
        type: DataTypes.STRING,          // Tipo de mesa, como “familiar” o “para dos”
        allowNull: true

    },
    table_estado:{
        type: DataTypes.STRING,          // Estado de la mesa, ej. “disponible” o “ocupada”
        allowNull: true
    },
    table_descripcion:{
        type: DataTypes.TEXT,            // Descripción adicional o notas
        allowNull: true
    },
    table_disponibilidad:{
        type: DataTypes.STRING,            // Puede almacenar un arreglo de horarios disponibles
        allowNull: false
    }

},
{
    sequelize,
    modelName: 'Table'
});

module.exports = Table; 
// async function testConnection(){
//          try{
//              await sequelize .authenticate()
//              console.log("todo bien")
//          } catch(err){
//              console.error ("Todo mal ", err);
            
//          }
//      }

//     te stConnection();