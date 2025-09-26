const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const Venta = sequelize.define('venta',{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    empresa_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'empresas',
            key : 'id'
        }
    },
    tienda_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'tiendas',
            key : 'id'
        }
    },
    caja_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'caja_tienda',
            key : 'id'
        }
    },
    trabajador_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'trabajadores',
            key : 'id'
        }
    },
    cliente_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'clientes',
            key : 'id'
        }
    },
    numero_venta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    fecha_venta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'completada'
    },
    tipo_pago: {
        type: DataTypes.STRING(20),
        defaultValue: 'efectivo'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },

}, {
    tableName: 'ventas',
    timestamps: false
});

module.exports = Venta;