const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Ventas = sequelize.define('Venta',{
    id_venta : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true
    },
    id_cliente : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    fecha : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    total : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    },
    metodo_pago : {
        type : DataTypes.ENUM("efectivo", "tarjeta", "yape", "credito"),
        allowNull : false
    },
    estado : {
        type : DataTypes.ENUM("pagado","pendiente"),
        allowNull : false
    }
}, {
    tableName : "ventas",
    timestamps : true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

module.exports = Ventas;
