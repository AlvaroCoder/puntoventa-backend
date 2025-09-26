const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const CategoriaEstandar = sequelize.define('categoria_estandar',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre de la categoría no puede estar vacío"
            },
            len: {
                args: [1, 255],
                msg: "El nombre debe tener entre 1 y 255 caracteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            len: {
                args: [0, 50],
                msg: "El código no puede exceder 50 caracteres"
            }
        }
    },
    rubro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rubros_negocios',
            key: 'id'
        }
    },
    categoria_padre_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categorias_estandar',
            key: 'id'
        }
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    tableName: 'categorias_estandar',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['nombre', 'rubro_id'],
            name: 'uk_nombre_rubro'
        },
        {
            fields: ['rubro_id'],
            name: 'idx_rubro'
        }
    ]
});

module.exports = CategoriaEstandar;