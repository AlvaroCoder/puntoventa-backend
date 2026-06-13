const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const ConfigPuntos = sequelize.define('config_puntos', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'empresas',
            key: 'id'
        }
    },
    soles_por_punto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.00
    },
    puntos_por_caje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    vencimiento_dias: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 365
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'config_puntos',
    timestamps: true,
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['empresa_id']
        }
    ],
    updatedAt : 'updated_at'
});

module.exports = ConfigPuntos;