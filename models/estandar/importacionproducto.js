const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const ImportacionProducto = sequelize.define('importaciones_productos',{
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
    rubro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rubros_negocios',
            key: 'id'
        }
    },
    total_productos: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El total de productos no puede ser negativo"
            }
        }
    },
    productos_importados: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "Los productos importados no pueden ser negativos"
            }
        }
    },
    productos_actualizados: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "Los productos actualizados no pueden ser negativos"
            }
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente',
        validate: {
            isIn: {
                args: [['pendiente', 'procesando', 'completada', 'error', 'cancelada']],
                msg: "Estado de importación no válido"
            }
        }
    },
    archivo_original: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: "La ruta del archivo no puede exceder 500 caracteres"
            }
        }
    },
    configuracion_mapeo: {
        type: DataTypes.JSON,
        allowNull: true
    },
    errores: {
        type: DataTypes.JSON,
        allowNull: true
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de inicio debe ser válida"
            }
        }
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de fin debe ser válida"
            }
        }
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    }
},{
    tableName: 'importaciones_productos',
    timestamps: false
});

module.exports = ImportacionProducto;