const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const FacturaPago = sequelize.define("facturas_pagos", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    suscripcion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'suscripciones_empresas',
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
    numero_factura: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "El número de factura no puede estar vacío"
            },
            len: {
                args: [1, 100],
                msg: "El número de factura debe tener entre 1 y 100 caracteres"
            }
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "El monto debe ser mayor a 0"
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
    periodo_facturado: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            matches: {
                args: /^\d{4}-\d{2}$/,
                msg: "El periodo facturado debe tener el formato YYYY-MM"
            }
        }
    },
    fecha_emision: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de emisión debe ser válida"
            }
        }
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: "La fecha de vencimiento debe ser válida"
            },
            esFechaPosteriorEmision(value) {
                if (this.fecha_emision && value <= this.fecha_emision) {
                    throw new Error('La fecha de vencimiento debe ser posterior a la fecha de emisión');
                }
            }
        }
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La fecha de pago debe ser válida"
            }
        }
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'pendiente',
        validate: {
            isIn: {
                args: [['pendiente', 'pagada', 'vencida', 'cancelada', 'reembolsada']],
                msg: "Estado de factura no válido"
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
    referencia_pago: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: "La referencia de pago no puede exceder 100 caracteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    datos_factura: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'facturas_pagos',
    timestamps: false,
    indexes: [
        {
            fields: ['empresa_id'],
            name: 'idx_empresa'
        },
        {
            fields: ['estado'],
            name: 'idx_estado'
        },
        {
            fields: ['fecha_vencimiento'],
            name: 'idx_fecha_vencimiento'
        }
    ]
});

module.exports = FacturaPago;