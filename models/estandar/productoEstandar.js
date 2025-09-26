const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const ProductoEstandar = sequelize.define('producto_estandar',{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    codigo_barras: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
            len: {
                args: [0, 100],
                msg: "El código de barras no puede exceder 100 caracteres"
            }
        }
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre del producto no puede estar vacío"
            },
            len: {
                args: [1, 255],
                msg: "El nombre debe tener entre 1 y 255 caracteres"
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    marca_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'marcas_estandar',
            key : 'id'
        }
    },
    categoria_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'categorias_estandar',
            key : 'id'
        }
    },
    presentacion_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : 'presentaciones_estandar',
            key : 'id'
        }
    },
    contenido_neto : {
        type : DataTypes.DECIMAL(10,3),
        allowNull : true,
        validate: {
            min: {
                args: [0],
                msg: "El contenido neto no puede ser negativo"
            }
        }
    },
    unidad_medida : {
        type : DataTypes.STRING(50),
        allowNull : true,
        validate : {
            len : {
                args : [0,50],
                msg : "La unidad de medida no se puede exceder los 50 caracteres"
            }
        }
    },
    peso_gramos: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El peso no puede ser negativo"
            }
        }
    },
    volumen_ml: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "El volumen no puede ser negativo"
            }
        }
    },
    caracteristicas: {
        type: DataTypes.JSON,
        allowNull: true
    },
    imagen_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: "La URL de la imagen no puede exceder 500 caracteres"
            },
            isUrl: {
                msg: "La URL de la imagen debe ser válida"
            }
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
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: 'productos_estandar',
    timestamps: true,
    createdAt : "fecha_creacion",
    updatedAt : "fecha_actualizacion"
});

module.exports = ProductoEstandar;