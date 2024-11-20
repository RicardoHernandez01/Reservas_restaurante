const {Sequelize, Model, DataTypes} = require('sequelize');
const{ toDefaultValue } = require('sequelize/lib/utils');

const sequelize  = new Sequelize("reservas_restaurante", "root", "hernandez1",{
    host: "localhost",
    dialect: "mysql",
    port: "3306"
});

class Reservation extends Model{}

Reservation.init({
    reservation_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    table_id:{
        type:DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Tables',
            key:'table_id'
        }
    },
    cliente_id:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Clientes',
            key: 'cliente_id'
        }
    },
    reservacion_fecha:{
        type: DataTypes.DATE,
        allowNull:false

    },
    reservacion_hora:{
        type: DataTypes.TIME,
        allowNull:false

    },
    reservacion_num_personas:{
        type: DataTypes.INTEGER,
        allowNull: false

    },
    reservacion_comentarios:{ //Notas o solicitudes especiales del cliente
        type:DataTypes.STRING,
        allowNull:true
    },
    reservacion_alergias:{
        type:DataTypes.STRING,
        allowNull:true
    },
    reservacion_status:{ //ejemplo pendiente, confimada, cancelada
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue: 'pendiente'
    }

},
{
    sequelize,
    modelName:'Reservation'
});

module.exports = Reservation;