const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const NubefactLog = sequelize.define('nubefact_log', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'empresas', key: 'id' }
    },
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'ventas', key: 'id' }
    },
    tipo_comprobante: {
        type: DataTypes.ENUM('boleta', 'factura'),
        allowNull: false
    },
    serie: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    payload_enviado: {
        type: DataTypes.JSON,
        allowNull: true
    },
    respuesta_api: {
        type: DataTypes.JSON,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'enviado', 'aceptado', 'rechazado', 'error'),
        allowNull: false,
        defaultValue: 'pendiente'
    },
    codigo_error: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    mensaje_error: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url_pdf: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    url_xml: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    hash_cdr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_envio: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_respuesta: {
        type: DataTypes.DATE,
        allowNull: true
    },
    intentos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'nubefact_log',
    timestamps: false,
    indexes: [
        { fields: ['empresa_id'] },
        { fields: ['venta_id'] },
        { fields: ['estado'] },
        { fields: ['fecha_envio'] }
    ]
});

module.exports = NubefactLog;