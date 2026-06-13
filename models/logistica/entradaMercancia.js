const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const EntradasMercancia = sequelize.define('entradas_mercancia', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    orden_compra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'ordenes_compra', key: 'id' }  // ✅ corregido
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tiendas', key: 'id' }  // ✅ corregido
    },
    trabajador_recibe: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'trabajadores', key: 'id' }
    },
    trabajador_aprueba: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'trabajadores', key: 'id' }
    },
    numero_em: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    numero_factura_proveedor: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('registrada', 'aprobada', 'rechazada'),
        allowNull: false,
        defaultValue: 'registrada'
    },
    fecha_recepcion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_aprobacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    motivo_rechazo: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'entradas_mercancia',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, 
    indexes: [
        {
            unique: true,
            fields: ['numero_em', 'orden_compra_id']  
        },
        { fields: ['orden_compra_id'] },
        { fields: ['tienda_id'] },
        { fields: ['estado'] }
    ]
});

module.exports = EntradasMercancia;