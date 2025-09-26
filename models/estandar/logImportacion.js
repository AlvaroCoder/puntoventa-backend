const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const LogImportacion = sequelize.define('log_importaciones',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    importacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'importaciones_productos',
            key: 'id'
        }
    },
    producto_estandar_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'productos_estandar',
            key: 'id'
        }
    },
    accion: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isIn: {
                args: [['importar', 'actualizar', 'omitir', 'error', 'validar']],
                msg: "Acción no válida"
            }
        }
    },
    datos_originales: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            esJSONValido(value) {
                if (value && typeof value !== 'object') {
                    throw new Error('Los datos originales deben ser un objeto JSON válido');
                }
            }
        }
    },
    datos_mapeados: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            esJSONValido(value) {
                if (value && typeof value !== 'object') {
                    throw new Error('Los datos mapeados deben ser un objeto JSON válido');
                }
            }
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 5000],
                msg: "El mensaje no puede exceder 5000 caracteres"
            }
        }
    },
    exito: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: 'log_importaciones',
    timestamps: false
});

module.exports = LogImportacion;
