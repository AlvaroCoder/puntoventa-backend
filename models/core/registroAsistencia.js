const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const RegistroAsistencia = sequelize.define("registros_asistencia", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tiendas',
            key: 'id'
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_entrada: {
        type: DataTypes.TIME,
        allowNull: true
    },
    hora_salida: {
        type: DataTypes.TIME,
        allowNull: true
    },
    tipo_registro: {
        type: DataTypes.STRING(20),
        defaultValue: 'manual'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ip_dispositivo: {
        type: DataTypes.STRING(45),
        allowNull: true
    }
}, {
    tableName: 'registros_asistencia',
    timestamps: false
});

module.exports = RegistroAsistencia;