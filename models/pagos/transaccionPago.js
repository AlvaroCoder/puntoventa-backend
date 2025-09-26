const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const TransaccionPago = sequelize.define("transacciones_pago", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    factura_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'facturas_pagos',
            key: 'id'
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
    moneda: {
        type: DataTypes.STRING(10),
        defaultValue: 'USD',
        validate: {
            isIn: {
                args: [['USD', 'PEN', 'EUR']],
                msg: "Moneda no válida"
            }
        }
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: {
                args: [['stripe', 'paypal', 'transferencia', 'efectivo', 'tarjeta']],
                msg: "Método de pago no válido"
            }
        }
    },
    id_transaccion_externo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
            len: {
                args: [0, 100],
                msg: "El ID de transacción externo no puede exceder 100 caracteres"
            }
        }
    },
    estado_transaccion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: {
                args: [['completed', 'pending', 'failed', 'refunded', 'canceled']],
                msg: "Estado de transacción no válido"
            }
        }
    },
    datos_transaccion: {
        type: DataTypes.JSON,
        allowNull: true
    },
    fecha_transaccion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'transacciones_pago',
    timestamps: true,
    createdAt: 'fecha_transaccion',
    updatedAt: 'fecha_actualizacion',
    indexes: [
        {
            fields: ['factura_id'],
            name: 'idx_factura'
        },
        {
            fields: ['id_transaccion_externo'],
            name: 'idx_transaccion_externo'
        },
        {
            fields: ['estado_transaccion'],
            name: 'idx_estado'
        }
    ]
});

module.exports = TransaccionPago;