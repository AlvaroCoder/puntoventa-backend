const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const PlanSuscripcion = sequelize.define("planes_suscripcion", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "El nombre del plan no puede estar vacío"
            },
            len: {
                args: [1, 100],
                msg: "El nombre debe tener entre 1 y 100 caracteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio_mensual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El precio mensual no puede ser negativo"
            }
        }
    },
    precio_anual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El precio anual no puede ser negativo"
            }
        }
    },
    moneda: {
        type: DataTypes.STRING(10),
        defaultValue: 'USD',
        validate: {
            isIn: {
                args: [['USD', 'PEN', 'EUR']],
                msg: "Moneda no válida"
            }
        }
    },
    limite_empleados: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: {
                args: [0],
                msg: "El límite de empleados no puede ser negativo"
            }
        }
    },
    limite_tiendas: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
            min: {
                args: [0],
                msg: "El límite de tiendas no puede ser negativo"
            }
        }
    },
    limite_productos: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        validate: {
            min: {
                args: [0],
                msg: "El límite de productos no puede ser negativo"
            }
        }
    },
    caracteristicas: {
        type: DataTypes.JSON,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El orden no puede ser negativo"
            }
        }
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'planes_suscripcion',
    timestamps: false
});

module.exports = PlanSuscripcion;