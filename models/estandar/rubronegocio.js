const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const RubroNegocio = sequelize.define("rubros_negocios",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : "El nombre del rubro es necesario"
            },
            len : {
                args : [0,100],
                msg : "El nombre del rubro no puede ser mayor de 100 caracteres"
            }
        }
    },
    icono : {
        type : DataTypes.STRING(100),
        allowNull : true,
    },
    activo : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    },
    fecha_creacion : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
    }
},{
    tableName : 'rubros_negocios',
    timestamps : false
});

module.exports = RubroNegocio;