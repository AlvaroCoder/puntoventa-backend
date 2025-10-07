const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const Cliente = sequelize.define("cliente",{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    empresa_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'empresas',
            key : 'id'
        }
    },
    tipo_documento : {
        type : DataTypes.STRING(10),
        allowNull : true,
        defaultValue  : 'DNI'
    },
    numero_documento : {
        type : DataTypes.STRING(20),
        allowNull : false,
        unique : true,
    },
    nombre_completo : {
        type : DataTypes.STRING(255),
        allowNull : false,
        validate : {
            notEmpty : {
                msg : "Debe ingresar el nombre del cliente"
            }
        }
    },
    email : {
        type : DataTypes.STRING(255),
        allowNull : true,
        validate : {
            isEmail : {
                msg : "Ingrese un email valido"
            }
        },
        unique : true
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
    direccion : {
        type : DataTypes.TEXT,
        allowNull : true
    },
    fecha_registro :{
        type : DataTypes.DATEONLY,
        defaultValue : DataTypes.DATEONLY
    },
    categoria : {
        type: DataTypes.STRING(50),
        defaultValue: 'REGULAR',
        validate: {
            isIn: {
                args: [['REGULAR', 'DEUDOR', 'RESPONSABLE']],
                msg: "Categoría debe ser: REGULAR, DEUDOR o RESPONSABLE"
            }
        }
    }
},{
    tableName: 'clientes',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['empresa_id', 'tipo_documento', 'numero_documento'],
            name: 'uk_empresa_documento'
        }
    ]
});

module.exports = Cliente;