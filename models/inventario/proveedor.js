const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const Proveedor = sequelize.define("proveedores",{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    empresa_id :{ 
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'empresas',
            key : 'id'
        }
    },
    ruc : {
        type : DataTypes.STRING(20),
        allowNull : false,
        validate : {
            min : {
                args : [0],
                msg : "El ruc no puede ser negativo"
            },
            max : {
                args : [11],
                msg : "El ruc no puede ser de más de 11 dígitos"
            }
        }
    },
    nombre : {
        type : DataTypes.STRING(255),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : "El nombre es necesario"
            }
        }
    },
    telefono : {
        type : DataTypes.STRING(20),
        allowNull : true,
        validate : {
            min : {
                args : [0],
                msg : "El ruc no puede ser negativo"
            }
        }
    },
    email : {
        type : DataTypes.STRING(255),
        validate : {
            min : {
                args : [0],
                msg : "El ruc no puede ser negativo"
            }
        }
    },
    direccion : {
        type : DataTypes.TEXT,
        validate : {
            min : {
                args : [0],
                msg : "El ruc no puede ser negativo"
            }
        }
    },
    activo : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
},{
    tableName : "proveedores",
    indexes : [
        {
            fields : ['id','empresa_id']
        },
        {
            fields : ['ruc']
        }
    ]
});

module.exports = Proveedor;