const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const IAConversaciones = sequelize.define('ia_conversaciones', {
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
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    sesion_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "El ID de sesión es requerido"
            }
        }
    },
    canal: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'dashboard'
    },
    estado: {
        type: DataTypes.ENUM('activa', 'cerrada'),
        allowNull: false,
        defaultValue: 'activa'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'ia_conversaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['empresa_id'] },
        { fields: ['trabajador_id'] },
        { fields: ['estado'] }
    ]
});

module.exports = IAConversaciones;