const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const OrdenesCompra = sequelize.define('ordenes_compra', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proveedores',
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
        allowNull: false,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    numero_oc: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tipos_oc: {
        type: DataTypes.ENUM('estandar', 'abierta'),
        allowNull: false,
        defaultValue: 'estandar'
    },
    estado: {
        type: DataTypes.ENUM('borrador', 'enviada', 'confirmada', 'parcial', 'completada', 'cancelada'),
        allowNull: false,
        defaultValue: 'borrador'
    },
    fecha_emision: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_estimada: {
        type: DataTypes.DATE,
        allowNull: true
    },
    monto_total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    monto_recibido: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    moneda: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'PEN'
    },
    condiciones_pago: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_vigencia_ini: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha_vigencia_fin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'ordenes_compra',
    timestamps: true,
    indexes: [
        {
            fields: ['proveedor_id']
        },
        {
            fields: ['tienda_id']
        },
        {
            fields: ['empresa_id']
        },
        {
            fields : ['trabajador_id']
        }
    ],
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = OrdenesCompra;