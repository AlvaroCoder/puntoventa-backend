const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const CajaTienda = sequelize.define("caja_tienda",{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tiendas',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre de la caja no puede estar vacío"
            },
            len: {
                args: [1, 100],
                msg: "El nombre debe tener entre 1 y 100 caracteres"
            }
        }
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "El código de la caja no puede estar vacío"
            },
            len: {
                args: [1, 50],
                msg: "El código debe tener entre 1 y 50 caracteres"
            }
        }
    },
    saldo_inicial: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El saldo inicial no puede ser negativo"
            }
        }
    },
    saldo_actual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El saldo actual no puede ser negativo"
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
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: 'cajas_tienda',
    timestamps: false
});
module.exports = CajaTienda;