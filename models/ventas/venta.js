const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const Venta = sequelize.define('venta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
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
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tiendas',
            key: 'id'
        }
    },
    caja_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cajas_tienda',
            key: 'id'
        }
    },
    trabajador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trabajadores',
            key: 'id'
        }
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clientes',
            key: 'id'
        }
    },
    numero_venta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    fecha_venta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('completada', 'anulada', 'pendiente'),
        defaultValue: 'completada'
    },
    tipo_pago: {
        type: DataTypes.STRING(20),
        defaultValue: 'efectivo',
        validate: {
            isIn: {
            args: [['efectivo', 'tarjeta', 'credito', 'mixto', 'yape', 'plin']],
                msg: "El tipo de pago debe ser 'efectivo', 'tarjeta' o 'credito'"
            }
        }
    },
    tipo_comprobante: {
        type: DataTypes.STRING(20),
        defaultValue: 'boleta',
        validate: {
            isIn: {
                args: [['boleta', 'factura', 'ticket', 'ninguno']],
                msg: "El tipo de comprobante debe ser 'boleta' o 'factura'"
            }
        }
    },
    monto_recibido: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    vuelto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    puntos_ganados: {
      type : DataTypes.INTEGER,
      defaultValue : 0  
    },
    puntos_canjeados: {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },

    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    igv: {
        type : DataTypes.DECIMAL(10, 2),
        defaultValue : 0
    },
    nubefact_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    nubefact_serie: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    nubefact_numero: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    nubefact_url_pdf: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    nubefact_url_xml: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    nubefact_hash: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    hora_venta: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    dia_semana: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    es_fin_semana: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    es_campana: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    nubefact_estado: {
    type: DataTypes.ENUM('pendiente', 'enviado', 'aceptado', 'rechazado'),
    allowNull: true
    },
    nombre_campana: {
    type: DataTypes.STRING(100),
    allowNull: true
    }
    
}, {
    tableName: 'ventas',
    timestamps: false
});

module.exports = Venta;