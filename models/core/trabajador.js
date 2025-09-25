const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const Trabajador = sequelize.define("trabajadores",{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    empresa_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'empresas',
            key : 'id'
        }
    },
    usuario_id : {
        type : DataTypes.INTEGER,
        allowNull :false,
        references : {
            model : 'usuarios',
            key : 'id'
        }
    },
    tienda_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'tiendas',
            key : 'id'
        }
    },
    codigo_empleado : {
        type : DataTypes.STRING(50),
        allowNull : false,
        validate : {
            len : {
                args : [0,50],
                msg : "No se puede crear un codigo de mas de 50 caracteres"
            },
            notEmpty : {
                msg : "Debes completar este campo"
            }
        }
    },
    nombre_completo : {
        type : DataTypes.STRING(255),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : "Debes ingresar el nombre completo del trabajador"
            }
        }
    },
    tipo_documento : {
        type : DataTypes.STRING(10),
        allowNull : true,
        defaultValue : 'DNI'
    },
    numero_documento : {
        type : DataTypes.STRING(20),
        allowNull : false,
        unique : true
    },
    email : {
        type : DataTypes.STRING(255),
        allowNull : true,
        unique : true,
        validate : {
            isEmail : {
                msg : "El email debe ser valido"
            }
        }
    },
    telefono : {
        type : DataTypes.STRING(20),
        allowNull : true,
        validate : {
            is: {
                args: /^[0-9+\-\s()]*$/i,
                msg: "Formato de teléfono no válido"
            }
        }
    },
    fecha_contratacion : {
        type : DataTypes.DATEONLY,
        defaultValue : DataTypes.NOW(),
    },
    salario_base : {
        type : DataTypes.DECIMAL(10,2),
        allowNull : true,
        defaultValue : 1025.0
    },
    activo : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
},{
    tableName : 'trabajadores',
    timestamps : false
});

module.exports = Trabajador;