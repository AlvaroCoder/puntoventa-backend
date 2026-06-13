const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const EntradasMercanciaDetalle = sequelize.define('entradas_mercancia_detalle', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    entrada_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'entradas_mercancia', key: 'id' }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'productos', key: 'id' }
    },
    variante_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'producto_variantes', key: 'id' }
    },
    cantidad_esperada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "La cantidad esperada no puede ser negativa"
            }
        }
    },
    cantidad_recibida: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'entradas_mercancia_detalle',
    timestamps: false,  
    indexes: [
        { fields: ['entrada_id'] },
        { fields: ['producto_id'] },
        { fields: ['variante_id'] }
    ]
});

module.exports = EntradasMercanciaDetalle;