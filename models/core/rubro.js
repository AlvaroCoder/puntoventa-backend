const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const Rubro = sequelize.define("rubros_negocios", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull : false
    },
    descripcion : {
        type: DataTypes.TEXT,
        allowNull : true
    },
    icono: {
        type: DataTypes.STRING,
        allowNull : true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'rubros_negocios',
    deletedAt : false
});

module.exports = Rubro;

