const sequelize = require('../../config/db');
const {DataTypes, NOW} = require("sequelize");

const MovimientoInventario = sequelize.define("movimientos_inventario",{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey: true
    },
    producto_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'productos',
            key : 'id'
        }
    },
    tienda_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'tiendas',
            key : 'id'
        }
    },
    tipo_movimiento: {
        type: DataTypes.ENUM(
            'entrada', 'salida', 'ajuste', 
            'transferencia_entrada', 'transferencia_salida',
            'devolucion', 'merma', 'caducado'
        ),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El tipo de movimiento es requerido"
            },
            isIn: {
                args: [[
                    'entrada', 'salida', 'ajuste', 
                    'transferencia_entrada', 'transferencia_salida',
                    'devolucion', 'merma', 'caducado'
                ]],
                msg: "Tipo de movimiento no válido"
            }
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "La cantidad es requerida"
            },
            min: {
                args: [1],  
                msg: "La cantidad debe ser mayor a 0"
            }
        }
    },
    cantidad_anterior : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            notNull: {
                msg: "La cantidad es requerida"
            },
            min : {
                args : [0],
                msg : "La cantidad no puede ser negativa"
            }
        }
    },
    cantidad_nueva : {
        type : DataTypes.INTEGER,
        allowNull : false,
        validate : {
            min : {
                args : [0],
                msg : "La cantidad no puede ser negativa"
            }
        }
    },
    referencia_id : {
        type : DataTypes.INTEGER,
        validate : {
            min : {
                args : [0],
                msg : "La cantidad no puede ser negativa"
            }
        }
    },
    referencia_tipo: {
        type: DataTypes.ENUM(
            'venta', 'compra', 'conteo_fisico', 
            'transferencia', 'devolucion', 'ajuste_manual', 'merma'
        ),
        allowNull: true, 
        validate: {
            isIn: {
                args: [[
                    'venta', 'compra', 'conteo_fisico', 
                    'transferencia', 'devolucion', 'ajuste_manual', 'merma'
                ]],
                msg: "Tipo de referencia no válido"
            }
        }
    },
    concepto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El concepto es requerido"
            },
            len: {
                args: [5, 1000],
                msg: "El concepto debe tener entre 5 y 1000 caracteres"
            }
        }
    },
    fecha_movimiento : {
        type : DataTypes.DATE,
        defaultValue : NOW,
        validate: {
            isDate: {
                msg: "La fecha debe ser válida"
            }
        }
    },
    trabajador_id : {
        type : DataTypes.INTEGER,
        references : {
            model : 'trabajadores',
            key : 'id'
        }
    }
},{
    tableName: 'movimientos_inventario',
    timestamps: true, 
    paranoid: true,  
    indexes: [
        {
            fields: ['producto_id', 'fecha_movimiento']
        },
        {
            fields: ['tienda_id']
        },
        {
            fields: ['tipo_movimiento']
        },
        {
            fields: ['referencia_tipo', 'referencia_id']
        }
    ]
});

module.exports = MovimientoInventario;