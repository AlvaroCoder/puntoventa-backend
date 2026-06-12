const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const ModulosSistema = sequelize.define('modulos_sistema', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre del módulo es requerido"
            },
            len: {
                args: [0, 100],
                msg: "El nombre debe tener menos de 100 caracteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "El código del módulo es requerido"
            },
            len: {
                args: [0, 50],
                msg: "El código debe tener menos de 50 caracteres"
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'modulos_sistema',
    timestamps: true,
});

module.exports = ModulosSistema;