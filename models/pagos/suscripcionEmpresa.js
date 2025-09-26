const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const SuscripcionEmpresa = sequelize.define("suscripciones_empresas", {
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
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'planes_suscripcion',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'activa',
        validate: {
            isIn: {
                args: [['activa', 'pendiente', 'suspendida', 'cancelada', 'expirada']],
                msg: "Estado de suscripción no válido"
            }
        }
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de inicio debe ser válida"
            }
        }
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de fin debe ser válida"
            },
            esFechaPosteriorInicio(value) {
                if (this.fecha_inicio && value <= this.fecha_inicio) {
                    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
                }
            }
        }
    },
    fecha_proximo_pago: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de próximo pago debe ser válida"
            }
        }
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: {
                args: [['stripe', 'paypal', 'transferencia', 'efectivo']],
                msg: "Método de pago no válido"
            }
        }
    },
    id_pago_externo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: "El ID de pago externo no puede exceder 100 caracteres"
            }
        }
    },
    datos_pago: {
        type: DataTypes.JSON,
        allowNull: true
    },
    ciclo_facturacion: {
        type: DataTypes.STRING(20),
        defaultValue: 'mensual',
        validate: {
            isIn: {
                args: [['mensual', 'anual']],
                msg: "Ciclo de facturación no válido"
            }
        }
    }
}, {
    tableName: 'suscripciones_empresas',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['empresa_id', 'estado'],
            name: 'uk_empresa_activa',
            where: {
                estado: 'activa'
            }
        },
        {
            fields: ['estado'],
            name: 'idx_estado'
        },
        {
            fields: ['fecha_proximo_pago'],
            name: 'idx_fecha_proximo_pago'
        }
    ]
});

module.exports = SuscripcionEmpresa;