const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define('Producto', {
    id_producto : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true
    },
    nombre_producto : {
        type : DataTypes.STRING,
        allowNull : false
    },
    descripcion : {
        type : DataTypes.STRING,
    },
    precio : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    }
})

module.exports = Producto;
