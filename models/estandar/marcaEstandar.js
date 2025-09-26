const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const MarcaEstandar = sequelize.define('marcas_estandar',{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    nombre : {
        type : DataTypes.STRING(255),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : "El nombre de la marca no debe estar vacio"
            },
            len : {
                args : [255],
                msg  : "El nombre de la marca no debe pasar los 255 caracteres"
            }
        }
    },
    descripcion : {
        type : DataTypes.TEXT,
        allowNull : true,
    },
    logo_url : {
        type : DataTypes.STRING(500),
        allowNull : true,
        defaultValue : ''
    },
    rubro_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'rubros_negocios',
            key : 'id'
        }
    },
    activa : {
        allowNull : true,
        type : DataTypes.BOOLEAN,
        defaultValue : true
    },
    fecha_creacion : {
        type : DataTypes.DATE,
        allowNull : true,
        defaultValue : DataTypes.NOW
    }
},{
    tableName : 'marcas_estandar',
    timestamps : false
});

module.exports = MarcaEstandar;