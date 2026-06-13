const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const PuntosMovimientos = sequelize.define('puntos_movimientos', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clientes',
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
    tipo: {
        type: DataTypes.ENUM('acumulacion', 'canje', 'vencimiento', 'ajuste'),
        allowNull: false
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    saldo_anterior: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    saldo_nuevo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    referencia_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    referencia_tipo: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: "La descripción no puede exceder 500 caracteres"
            }
        }
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'puntos_movimientos',
    timestamps: true,
    indexes: [
        {
            fields: ['cliente_id']
        },
        {
            fields: ['empresa_id']
        },
        {
            fields: ['id']
        }
    ]
});

module.exports = PuntosMovimientos;