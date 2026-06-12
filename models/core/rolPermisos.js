const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const RolPermisos = sequelize.define('rol_permisos', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    modulo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modulos_sistema',
            key: 'id'
        }
    },
    puede_ver: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    puede_crear: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    puede_editar: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    puede_eliminar: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'rol_permisos',
    timestamps: true,
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['rol_id']
        },
        {
            fields: ['modulo_id']
        }
    ]
});

module.exports = RolPermisos;