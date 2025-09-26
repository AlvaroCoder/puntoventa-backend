const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const PagoCredito = sequelize.define("pagos_creditos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    credito_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'creditos_clientes',
            key: 'id'
        }
    },
    monto_pago: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "El monto del pago debe ser mayor a 0"
            },
            isDecimal: {
                args: { min: 0.01 },
                msg: "El monto debe ser un valor decimal válido"
            }
        }
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: "La fecha de pago debe ser válida"
            }
        }
    },
    metodo_pago: {
        type: DataTypes.STRING(20),
        defaultValue: 'efectivo',
        validate: {
            isIn: {
                args: [['efectivo', 'tarjeta', 'transferencia', 'cheque', 'deposito']],
                msg: "Método de pago no válido"
            }
        }
    },
    referencia_pago: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: "La referencia no puede exceder 100 caracteres"
            }
        }
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    }
}, {
    tableName: 'pagos_creditos',
    timestamps: false,
    indexes: [
        {
            fields: ['credito_id'],
            name: 'idx_credito'
        },
        {
            fields: ['fecha_pago'],
            name: 'idx_fecha_pago'
        }
    ]
});

module.exports = PagoCredito;