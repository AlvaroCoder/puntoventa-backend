const {DataTypes} = require("sequelize");
const sequelize = require('../config/db');

const Tienda = sequelize.define('Tienda',{
    id_tienda : {
        type : DataTypes.INTEGER,
        unique : true,
        autoIncrement : true,
        primaryKey : true
    },
    nombre : {
        type : DataTypes.STRING,
        allowNull : false
    },
    direccion : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    telefono : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    estado : {
        type : DataTypes.ENUM("activa","inactiva"),
        defaultValue : 'activa'
    }
},{
    tableName : 'tiendas',
    timestamps : true,
    createdAt : "created_at",
    updatedAt : "updated_at"
});

module.exports = Tienda;
