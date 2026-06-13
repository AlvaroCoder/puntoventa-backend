const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const ProductoVariantes = sequelize.define('producto_variantes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos',
            key: 'id'
        }
    },
    talla: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    codigo_variante: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    codigo_barras: {
        type: DataTypes.STRING(100),
        defaultValue: "",
        allowNull: true
    },
    precio_adicional: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'producto_variantes',
    timestamps: true,
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['producto_id']
        }],
    createdAt: 'created_at',
});

module.exports = ProductoVariantes;
