const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Creditos = sequelize.define('Creditos',{
    id_credito:{
        type : DataTypes.INTEGER,
        unique : true,
        autoIncrement : true
    },
    monto_total : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    },
    monto_pagado : {
        type : DataTypes.DECIMAL(10,2),
        defaultValue : 0
    },
    fecha_vencimiento: {
        type: DataTypes.DATE,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "pagado", "vencido"),
      defaultValue: "pendiente",
    },
},
{
    tableName: 'creditos',
    timestamps: true,
    createdAt: "fecha_inicio",
    updatedAt: false,
})
module.exports = Creditos;
