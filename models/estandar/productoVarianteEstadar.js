const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const ProductoVarianteEstandar = sequelize.define('producto_variantes_estandar', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey : true
    },
    producto_estandar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos_estandar',
            key: 'id'
        }
    },
    talla: {
        type: DataTypes.STRING(20),
        allowNull : true
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull : true
    },
    codigo_barras: { 
        type: DataTypes.STRING(100),
        allowNull: true, 
        unique : true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    }
}, {
    tableName: 'producto_variantes_estandar',
    timestamps: false,
    indexes: [
    {
        fields: ['producto_estandar_id'] 
    }
    ]
});

module.exports = ProductoVarianteEstandar;