const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const PrecioReferencia = sequelize.define('precio_referencia',{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos_estandar',
            key: 'id'
        }
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "La región no puede estar vacía"
            },
            len: {
                args: [1, 100],
                msg: "La región debe tener entre 1 y 100 caracteres"
            }
        }
    },
    precio_minorista: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El precio minorista no puede ser negativo"
            },
            esPrecioValido(value) {
                if (value !== null && value < 0.01) {
                    throw new Error('El precio minorista debe ser mayor a 0.01');
                }
            }
        }
    },
    precio_mayorista: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El precio mayorista no puede ser negativo"
            },
            esPrecioValido(value) {
                if (value !== null && value < 0.01) {
                    throw new Error('El precio minorista debe ser mayor a 0.01');
                }
            }
        }
    },
    precio_proveedor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El precio de proveedor no puede ser negativo"
            }
        }
    },
    moneda: {
        type: DataTypes.STRING(10),
        defaultValue: 'PEN',
        validate: {
            isIn: {
                args: [['PEN', 'USD', 'EUR']],
                msg: "Moneda no válida"
            }
        }
    },
    fecha_vigencia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de vigencia debe ser válida"
            },
            isAfter: {
                args: new Date().toISOString().split('T')[0],
                msg: "La fecha de vigencia debe ser futura"
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    tableName: 'precios_referencia',
    timestamps: false
});

module.exports = PrecioReferencia;
