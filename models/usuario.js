const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('usuario',{
    id_usuario : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    nombre_usuario : {
        type : DataTypes.STRING,
        allowNull : false
    },
    contrasena : {
        type : DataTypes.STRING,
        allowNull : false
    },
    rol : {
        type : DataTypes.STRING,
        defaultValue : 'Administrador'
    }
},
{
    timestamps : false
});

module.exports = Usuario;