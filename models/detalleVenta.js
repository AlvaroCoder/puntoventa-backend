const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const DetalleVentas = sequelize.define('DetalleVentas',{
    id_detalle : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    cantidad : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    precio_unitario : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    }
},{
    tableName : "detalle_ventas",
    timestamps : false
});

module.exports = DetalleVentas;