const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const CajaSesiones = sequelize.define('caja_sesiones', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    caja_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'cajas_tienda', key: 'id' } 
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tiendas', key: 'id' } 
    },
    trabajador_apertura_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'trabajadores', key: 'id' }
    },
    trabajador_cierre_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'trabajadores', key: 'id' }
    },
    monto_apertura: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El monto de apertura no puede ser negativo" 
            }
        }
    },
    monto_cierre_sistema: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    monto_cierre_real: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    diferencia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
    },
    total_ventas_efectivo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_ventas_tarjeta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_ventas_digital: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_creditos_cobrados: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_ventas_credito: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    total_ventas_dia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    estado: {
        type: DataTypes.ENUM('abierta', 'cerrada'),
        allowNull: false,
        defaultValue: 'abierta'
    },
    fecha_apertura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_cierre: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'caja_sesiones',
    timestamps: false, 
    indexes: [
        { fields: ['caja_id'] },
        { fields: ['tienda_id'] },
        { fields: ['estado'] },
        { fields: ['fecha_apertura'] }
    ]
});

module.exports = CajaSesiones;