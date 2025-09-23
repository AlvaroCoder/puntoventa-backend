const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define('Producto', {
    id_producto : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    nombre_producto : {
        type : DataTypes.STRING,
        allowNull : false
    },
    descripcion : {
        type : DataTypes.TEXT,
        allowNull : true
    },
    precio : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : false
    },
    stock : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
},{
    tableName : "productos",
    timestamps : true,
    createdAt : "created_at",
    updatedAt : "updated_at"
});

module.exports = Producto;
