const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const PresentacionEstandar = sequelize.define('presentacion_estandar',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre de la presentación no puede estar vacío"
            },
            len: {
                args: [1, 100],
                msg: "El nombre debe tener entre 1 y 100 caracteres"
            }
        }
    },
    abreviatura: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            len: {
                args: [0, 20],
                msg: "La abreviatura no puede exceder 20 caracteres"
            }
        }
    },
    factor_conversion: {
        type: DataTypes.DECIMAL(10, 3),
        defaultValue: 1.000,
        validate: {
            min: {
                args: [0.001],
                msg: "El factor de conversión debe ser mayor a 0"
            }
        }
    },
    rubro_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'rubros_negocios',
            key: 'id'
        }
    },
    es_principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    tableName: 'presentaciones_estandar',
    timestamps: false,
    indexes: [
        {
            fields: ['rubro_id'],
            name: 'idx_rubro'
        }
    ]
});

module.exports = PresentacionEstandar;