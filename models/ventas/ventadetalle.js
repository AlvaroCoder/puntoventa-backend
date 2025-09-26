const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const VentaDetalle = sequelize.define('venta_detalles',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ventas',
            key: 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos',
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: "La cantidad debe ser mayor a 0"
            }
        }
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El precio unitario no puede ser negativo"
            }
        }
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El descuento no puede ser negativo"
            }
        }
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El subtotal no puede ser negativo"
            }
        }
    },
    impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "El impuesto no puede ser negativo"
            }
        }
    },
    total_linea: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "El total de línea no puede ser negativo"
            }
        }
    }
},{
    tableName: 'venta_detalles',
    timestamps: false,
    validate : {
        validarCalculos(){
            const subTotal = (this.cantidad *  this.precio_unitario ) - this.descuento;
            const total = subTotal * this.impuesto;
            if (this.subtotal !== subtotalCalculado) {
                throw new Error('El subtotal no coincide con el cálculo (cantidad * precio - descuento)');
            }
        }
    }
});

module.exports = VentaDetalle;