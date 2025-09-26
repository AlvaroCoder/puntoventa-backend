const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const CajaMovimiento = sequelize.define('caja_movimiento',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    caja_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cajas_tienda',
            key: 'id'
        }
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    tipo_movimiento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: {
                args: [['apertura', 'cierre', 'ingreso', 'egreso', 'ajuste']],
                msg: "Tipo de movimiento no válido"
            }
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "El monto debe ser mayor a 0"
            }
        }
    },
    saldo_anterior: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El saldo anterior no puede ser negativo"
            }
        }
    },
    saldo_nuevo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El saldo nuevo no puede ser negativo"
            }
        }
    },
    concepto: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: "El concepto no puede exceder 500 caracteres"
            }
        }
    },
    fecha_hora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: "Las observaciones no pueden exceder 1000 caracteres"
            }
        }
    }
}, {
    tableName: 'caja_movimientos',
    timestamps: false
});

module.exports = CajaMovimiento;