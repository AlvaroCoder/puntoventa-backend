const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const TrabajadorRoles = sequelize.define('trabajador_roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tienda',
            key: 'id'
        }
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'trabajador_roles',
    timestamps: true,
    indexes: [
        {
            fields: ['id']
        },
        {
            fields: ['trabajador_id']
        },
        {
            fields: ['rol_id']
        },
        {
            fields: ['tienda_id']
        }
    ]
});

module.exports = TrabajadorRoles;