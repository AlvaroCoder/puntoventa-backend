const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const CreditoCliente = sequelize.define('credito_cliente',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'id'
        }
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id'
        }
    },
    monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El monto total no puede ser negativo"
            }
        }
    },
    saldo_pendiente: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El saldo pendiente no puede ser negativo"
            }
        }
    },
    fecha_credito: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de crédito debe ser válida"
            }
        }
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de vencimiento debe ser válida"
            }
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente',
        validate: {
            isIn: {
                args: [['pendiente', 'pagado', 'vencido', 'cancelado']],
                msg: "Estado de crédito no válido"
            }
        }
    },
    tasa_interes: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull : true,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "La tasa de interés no puede ser negativa"
            },
            max: {
                args: [100],
                msg: "La tasa de interés no puede ser mayor a 100%"
            }
        }
    }
},{
    tableName: 'creditos_clientes',
    timestamps: false
});

module.exports = CreditoCliente;