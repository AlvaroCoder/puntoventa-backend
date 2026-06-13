const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const OrdenesCompraDetalle = sequelize.define('ordenes_compra_detalle', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    orden_compra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ordenes_compra',
            key: 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'producto',
            key: 'id'
        }
    },
    variante_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'producto_variantes',
            key: 'id'
        }
    },
    cantidad_solicitada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: "La cantidad solicitada debe ser al menos 1"
            }
        }
    },
    cantidad_recibida: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "La cantidad recibida no puede ser negativa"
            }
        }
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El precio unitario no puede ser negativo"
            }
        }
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'parcial', 'completado'),
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
            isIn: {
                args: [['pendiente', 'parcial', 'completado']],
                msg: "Estado no válido"
            }
        }
    }
}, {
    tableName: "ordenes_compra_detalle",
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['orden_compra_id']
        },
        {
            fields: ['producto_id']
        },
        {
            fields: ['variante_id']
        }
    ]
});

module.exports = OrdenesCompraDetalle;
