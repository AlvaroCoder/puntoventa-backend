const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const NubefactLog = sequelize.define('nubefact_config', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'empresas',
            key: 'id'
        }
    },
    token_api: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    ruc_emisor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El RUC del emisor es requerido"
            },
            len: {
                args: [11, 11],
                msg: "El RUC del emisor debe tener 11 caracteres"
            }
        }
    },
    razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "La razón social es requerida"
            }
        }
    },
    serie_boleta: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "La serie de la boleta es requerida"
            }
        }
    },
    serie_factura: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "La serie de la factura es requerida"
            }
        }
    },
    numero_boleta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_factura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ambiente: {
        type: DataTypes.ENUM('produccion', 'pruebas'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['produccion', 'pruebas']],
                msg: "El ambiente debe ser 'produccion' o 'pruebas'"
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},
    {
        tableName: 'nubefact_log',
        timestamps: true,
        indexes: [
            {
                fields: ['empresa_id']  
            }
        ],
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
    

module.exports = NubefactLog